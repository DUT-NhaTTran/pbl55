import base64
from datetime import datetime, timedelta
from urllib import request
from django.http import HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .serializers import *;
from .models import *;
from django.db import connections
from rest_framework.views import APIView
import json
from django.db.models.functions import TruncDate
from rest_framework import status
from rest_framework.response import Response
from django.http import JsonResponse
from django.db.models import Q, F, ExpressionWrapper, DurationField
from django.utils import timezone
from django.db.models import OuterRef, Subquery
from rest_framework import status
from django.db import transaction
import pytz
from django.db.models import Count, Sum
from django.shortcuts import get_object_or_404
from django.utils.dateparse import parse_date
from django.utils import timezone
from zoneinfo import ZoneInfo  # Sử dụng thư viện zoneinfo
from django.utils.dateparse import parse_datetime
from django.utils.timezone import make_aware
from pytz import utc, timezone
from datetime import timedelta
from django.utils.timezone import make_aware, is_naive
class AccountView(APIView):
    def post(self, request):
        username_txt = request.data.get('usernameTxt')
        password_txt = request.data.get('passwordTxt')
        print(username_txt,password_txt)
        try:
            account = Accounts.objects.get(username=username_txt, password=password_txt)
        except Accounts.DoesNotExist:
            return JsonResponse({
                'message': 'Fail',
              
            })
        return Response({"message":'Success',"username": account.username.uid, "role": account.role}, status=status.HTTP_200_OK)

class AccountChangeView(APIView):
    def post(self, request):
        if request.content_type == 'application/json':
            try:
                data = request.data
                username = data.get('usernameTxt')
                password = data.get('passwordTxt')
                newpassword = data.get('newpasswordTxt')
                reenterpassword = data.get('reenterpasswordTxt')

                print('Thông tin:', username, password, newpassword, reenterpassword)

                if newpassword != reenterpassword:
                    return Response({'message': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

                try:
                    account = Accounts.objects.get(username=username, password=password)
                    account.password = newpassword
                    account.save()
                    return Response({"message": "Success"}, status=status.HTTP_200_OK)
                except Accounts.DoesNotExist:
                    return Response({"message": 'Failed'}, status=status.HTTP_400_BAD_REQUEST)

            except Exception as e:
                return Response({'message': f'An error occurred: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)



import pytz

from datetime import datetime

class UserListView(APIView):
    def get(self, request):
        try:
            selected_date = request.GET.get('selectedDate')  # Nhận selectedDate từ request
            if selected_date:
                selected_date = datetime.strptime(selected_date, '%Y-%m-%d').date()
                users = (
                    Users.objects.filter(isadmin=0)
                    .select_related('cid', 'cid__fid')  # Thực hiện join bảng Classes và Faculties
                    .prefetch_related('checkin_set')     # Thực hiện join bảng CheckIn
                    .filter(checkin__time_in__date=selected_date)  # Lọc bản ghi theo ngày
                    .values(
                        'uid', 'name', 'email', 'id', 'gender', 'birth',
                        'cid__class_name', 'checkin__time_in', 'checkin__time_out', 'cid__fid__faculty_name'
                    )
                )
            else:
                # Trường hợp không có selectedDate, lấy tất cả người dùng
                users = (
                    Users.objects.filter(isadmin=0)
                    .select_related('cid', 'cid__fid')  # Thực hiện join bảng Classes và Faculties
                    .prefetch_related('checkin_set')     # Thực hiện join bảng CheckIn
                    .values(
                        'uid', 'name', 'email', 'id', 'gender', 'birth',
                        'cid__class_name', 'checkin__time_in', 'checkin__time_out', 'cid__fid__faculty_name'
                    )
                )

            results = []
            for user in users:
                user_data = {
                    'uid': user['uid'],
                    'name': user['name'],
                    'email': user['email'],
                    'id': user['id'],
                    'gender': user['gender'],
                    'birth': user['birth'],
                    'class_name': user['cid__class_name'] if user['cid__class_name'] else None,
                    'faculty_name': user['cid__fid__faculty_name'] if user['cid__fid__faculty_name'] else None,
                    'time_in': user['checkin__time_in'],
                   
                    'time_out': user['checkin__time_out']
                }
                results.append(user_data)
            return JsonResponse(results, safe=False)

        except Exception as e:
            print("Error executing query:", e)
            return JsonResponse({'error': 'Error executing query'}, status=500)



class UserManageView(APIView):
    def get(self, request):
        try:
            data = Users.objects.filter(isadmin=0).values(
                'uid', 'name', 'email', 'id', 'gender', 'birth',
                'cid__class_name', 'cid__fid__faculty_name'
            )

            results = []
            for row in data:
                results.append({
                    'uid': row['uid'],
                    'name': row['name'],
                    'email': row['email'],
                    'id': row['id'],
                    'gender': row['gender'],
                    'birth': row['birth'],
                    'class_name': row['cid__class_name'],
                    'faculty_name': row['cid__fid__faculty_name']
                })

            return JsonResponse(results, safe=False)

        except Exception as e:
            print("Error fetching data:", e)
            return JsonResponse({'error': 'Error fetching data'}, status=500)
import traceback
def check_book_quantity(book, quantity):
    if book.quantity < quantity:
        return Response(
            {
                'error': 'Not enough books to borrow', 
                'available_quantity': book.quantity
            },
            status=status.HTTP_400_BAD_REQUEST
        )
    return None

class SaveCheckin(APIView):
    def post(self, request):
        try:
            uid = request.data.get('uid')
            startDateTime = datetime.strptime(request.data.get('startDateTime'), '%Y-%m-%d %H:%M:%S')
            endDateTime = datetime.strptime(request.data.get('endDateTime'), '%Y-%m-%d %H:%M:%S')
            bookId = request.data.get('bookId')
            quantity = int(request.data.get('quantity', 1))
            limitDay = request.data.get('limitDay')
            mode = request.data.get('mode')
            current_tz = ZoneInfo(timezone.get_current_timezone_name())
            startDateTime = startDateTime.replace(tzinfo=current_tz)
            endDateTime = endDateTime.replace(tzinfo=current_tz)
            print("in",uid,startDateTime,endDateTime,bookId,quantity,limitDay,mode)

            user = Users.objects.filter(uid=uid, isadmin=0).first()
            
            if not user:
                return Response({'error': 'UID not found in User'}, status=status.HTTP_404_NOT_FOUND)
           
            book = Books.objects.filter(id=bookId).first()
            if not book:
                return Response({'error': 'BookId not found in Books'}, status=status.HTTP_404_NOT_FOUND)

            if mode == 'Borrow':
                print("bo")
                response = check_book_quantity(book, quantity)
                if response:
                    return response

                card = Cards.objects.create(
                    sid=user,
                    bid=book,
                    day_borrow=startDateTime,
                    day_return=None,
                    limit_day=limitDay
                )
                print("Borrow card created")

                book.quantity -= quantity

            elif mode == 'Return':
                print('re')
                card = Cards.objects.filter(sid=user, bid=book, day_return=None).first()
                if not card:
                    return Response({'error': 'No active borrow record found for this user and book'}, status=status.HTTP_400_BAD_REQUEST)

                card.day_return = endDateTime
                card.save()
                print("Return card updated")

                book.quantity += quantity
            else:
                return Response({'error': 'Invalid mode'}, status=status.HTTP_400_BAD_REQUEST)

            book.save()
            checkin = Checkin.objects.create(
                uid=user,
                time_in=startDateTime,
                time_out=endDateTime,
            )
            if checkin:
                return Response({
                    'success': 'Checkin saved successfully',
                    'checkin_id': checkin.chid,
                    'user_id': user.uid
                }, status=status.HTTP_201_CREATED)
            else:
                return Response({'error': 'Failed to save checkin'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


        except Exception as e:
            traceback.print_exc()  
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
# class SaveCheckin(APIView):
#     def post(self, request):
#         try:
#             data = request.data
#             uid = data.get('uid')
#             time_in = datetime.strptime(data.get('time_in'), '%Y-%m-%d %H:%M:%S')
#             time_out = datetime.strptime(data.get('time_out'), '%Y-%m-%d %H:%M:%S')
#             mode = data.get('mode')
#             books = data.get('books')

#             user = Users.objects.filter(uid=uid, isadmin=0).first()
#             if not user:
#                 return Response({'error': 'UID not found in User'}, status=status.HTTP_404_NOT_FOUND)
            
#             if mode not in ['Borrow', 'Return']:
#                 return Response({'error': 'Invalid mode'}, status=status.HTTP_400_BAD_REQUEST)
            
#             for book_id, quantity in books.items():
#                 book = Books.objects.filter(id=book_id).first()
#                 if not book:
#                     return Response({'error': f'BookId {book_id} not found in Books'}, status=status.HTTP_404_NOT_FOUND)

#                 if mode == 'Borrow':
#                     response = check_book_quantity(book, quantity)
#                     if response:
#                         return response

#                     card = Cards.objects.create(
#                         sid=user,
#                         bid=book,
#                         day_borrow=time_in,
#                         day_return=None,
#                         limit_day=None  # You may need to adjust this based on your requirements
#                     )
#                     print(f"Borrow card created for Book ID {book_id}")

#                     book.quantity -= quantity

#                 elif mode == 'Return':
#                     card = Cards.objects.filter(sid=user, bid=book, day_return=None).first()
#                     if not card:
#                         return Response({'error': f'No active borrow record found for User ID {uid} and Book ID {book_id}'}, status=status.HTTP_400_BAD_REQUEST)

#                     card.day_return = time_out
#                     card.save()
#                     print(f"Return card updated for Book ID {book_id}")

#                     book.quantity += quantity

#                 book.save()

#             checkin = Checkin.objects.create(
#                 uid=user,
#                 time_in=time_in,
#                 time_out=time_out,
#             )
#             print("checkin")

#             return Response({'success': 'Checkin saved successfully'}, status=status.HTTP_201_CREATED)

#         except Exception as e:
#             traceback.print_exc()  
#             return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def check_book_quantity(book, quantity):
    if book.quantity < quantity:
        return Response({'error': f'Not enough quantity available for Book ID {book.id}'}, status=status.HTTP_400_BAD_REQUEST)
    return None

        
class UserCheckingView(APIView):
    def get(self,response):
        try:
           
            sql = """
                SELECT
                    users.uid,
                    users.name,
                    users.email,
                    users.id,
                    users.gender,
                    users.birth,
                    classes.class_name,
                    c.day_borrow,
                    c.limit_day,
                    f.faculty_name
                FROM
                    Users AS users
                JOIN
                    Classes AS classes ON users.cid = classes.cid
                JOIN 
                    Cards AS c ON c.sid = users.uid
                JOIN
                    Faculties AS f ON f.fid= classes.fid
                WHERE
                    users.isAdmin = 0
                    AND (c.day_return IS NULL OR DATE_ADD(c.day_borrow, INTERVAL c.limit_day DAY) < c.day_return)
                    AND DATE_ADD(c.day_borrow, INTERVAL c.limit_day DAY) < NOW()

                GROUP BY
                    users.uid, users.name, users.email, users.id, users.gender, users.birth, classes.class_name, f.faculty_name;
            """
            with connections['default'].cursor() as cursor:
                cursor.execute(sql)  # Truyền selected_date vào câu lệnh SQL
                data = cursor.fetchall()

            results = []
            for row in data:
                results.append({
                    'uid': row[0],
                    'name': row[1],
                    'email': row[2],
                    'id': row[3],
                    'gender': row[4],
                    'birth': row[5],
                    'class_name': row[6],
                    'day_borrow':row[7],
                    'limit_day':row[8],
                    'faculty_name': row[9]
                })

            row_count = len(results)

            return JsonResponse({'results': results, 'row_count': row_count}, safe=False)

        except Exception as e:
            error_message = "Error executing query: {}".format(e)
            return JsonResponse({'error': error_message}, status=500)
class UserSearchView(APIView):
    def get(self, request):
        search_query = request.GET.get('searchQuery', '')

        if not search_query:
            return JsonResponse({'error': 'searchQuery is required'}, status=400)

        try:
            data = Users.objects.filter(
                Q(isAdmin=0) & (Q(uid__contains=search_query) | Q(name__contains=search_query))
            ).values(
                'uid', 'name', 'email', 'id', 'gender', 'birth',
                'cid__class_name', 'checkin__time_in', 'checkin__time_out'
            )

            results = []
            for row in data:
                results.append({
                    'uid': row['uid'],
                    'name': row['name'],
                    'email': row['email'],
                    'id': row['id'],
                    'gender': row['gender'],
                    'birth': row['birth'],
                    'class_name': row['cid__class_name'],
                    'time_in': row['checkin__time_in'],
                    'time_out': row['checkin__time_out'],
                })

            return JsonResponse(results, safe=False)

        except Exception as e:
            print(f"Error processing request: {e}")
            return JsonResponse({'error': 'Error processing request'}, status=500)

class UserDeleteView(APIView):
    def delete(self, request):
        if request.method == 'DELETE':
            print("xóa")
            try:
                data = json.loads(request.body)
                uids = data.get('uids')

                if not uids or not isinstance(uids, list):
                    return JsonResponse({'error': 'No uids provided or uids is not a list'}, status=400)

                for uid in uids:
                    Checkin.objects.filter(uid=uid).delete()
                    Cards.objects.filter(sid=uid).delete()
                    Accounts.objects.filter(username=str(uid)).delete()
                    try:
                        user = Users.objects.get(uid=uid)
                        user.delete()
                    except Users.DoesNotExist:
                        pass

                   

                return JsonResponse({'message': 'Records deleted successfully'}, status=200)

            except json.JSONDecodeError:
                return JsonResponse({'error': 'Invalid JSON format'}, status=400)

            except Exception as e:
                print(f"Error processing request: {e}")
                return JsonResponse({'error': 'An error occurred while processing the request'}, status=500)

        return JsonResponse({'error': 'Method not allowed'}, status=405)


class GetFidView(APIView):
    def get(self, request):
        try:
            faculties = Faculties.objects.values_list('faculty_name', flat=True)

            fid_list = [{'value': faculty_name, 'text': faculty_name} for faculty_name in faculties]

            return Response({'fids': fid_list})

        except Exception as e:
            print("Error fetching data:", e)
            return Response({'error': 'Error fetching data'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class GetClassesView(APIView):
    def post(self, request):
        try:
            data = request.data
            selected_fid = data.get('fid')

            if not selected_fid:
                return Response({'error': 'FID is required'}, status=status.HTTP_400_BAD_REQUEST)

            class_list = Classes.objects.filter(fid__faculty_name=selected_fid).values_list('class_name', flat=True)
            class_list = [{'value': class_name, 'text': class_name} for class_name in class_list]
            return Response({'classes': class_list})

        except Exception as e:
            print("Error:", e)
            return Response({'error': 'Error processing request'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class SaveUserView(APIView):
    def post(self, request):
        try:
            uid = request.POST.get('uid')
            name = request.POST.get('name')
            email = request.POST.get('email')
            user_id = request.POST.get('id')
            birth_date = request.POST.get('birthDate')
            gender = request.POST.get('gender')
            class_name = request.POST.get('class_name')
            faculty_name = request.POST.get('fid')
            avatar_file = request.FILES.get('avatar')

            gender = 1 if gender in ['male', '1'] else 0

            # Tìm `cid` dựa trên `class_name` và `faculty_name`
            class_instance = Classes.objects.filter(class_name=class_name, fid__faculty_name=faculty_name).first()

            if not class_instance:
                return Response({'error': 'Class not found for the provided class_name and faculty_name'}, status=status.HTTP_400_BAD_REQUEST)

            # Tạo một transaction để đảm bảo tính nhất quán trong việc lưu dữ liệu
            with transaction.atomic():
                user = Users.objects.create(
                    uid=uid,
                    name=name,
                    email=email,
                    id=user_id,
                    birth=birth_date,
                    gender=gender,
                    cid=class_instance,
                    isadmin=0
                )

                # Nếu có avatar, lưu vào bảng `Avatars`
                if avatar_file:
                    avatar_instance = Avatars.objects.create(uid=user, image=avatar_file.read())

            return Response({'message': 'User and avatar saved successfully'})

        except Exception as e:
            return Response({'error': f"Error saving user data: {e}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class SaveAccountView(APIView):
    def post(self, request):
        try:
            data = request.data
            username_id = data.get('username')  
            password = data.get('password')
            

            if not username_id or not password:
                return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = Users.objects.get(uid=username_id)
            except Users.DoesNotExist:              
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

            account = Accounts.objects.create(username=user, password=password, role=0)
            return Response({'message': 'Account saved successfully'})

        except Exception as e:
            print(f"Error saving account data: {e}")
            return Response({'error': 'Error saving account data'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class GetAvatarURLView(APIView):
    def post(self, request):
        try:
            data = request.data
            uid = data.get('sr')

            if not uid:
                return JsonResponse({'error': 'UID is required'}, status=400)

            avatar = Avatars.objects.filter(uid=uid).first()

            if avatar:
                binary_image = avatar.image
                base64_image = base64.b64encode(binary_image).decode('utf-8')

                return JsonResponse({'avatar_url': base64_image})
            else:
                return JsonResponse({'error': 'Avatar not found'}, status=404)

        except Exception as e:
            print(f"Error fetching avatar URL: {e}")
            return JsonResponse({'error': 'Error fetching avatar URL'}, status=500)


class GetCategoriesView(APIView):
    def get(self, request):
        try:
            tags = Books.objects.values_list('tag', flat=True).distinct()

            tag_list = [{'value': tag, 'text': tag} for tag in tags]

            return JsonResponse({'tags': tag_list}, safe=False)

        except Exception as e:
            print("Error executing query:", e)
            return JsonResponse({'error': 'Error executing query'}, status=500)

from django.utils import timezone

class GetBooksInfo(APIView):
    def get(self, request):
        try:
            books_with_images = Books.objects.filter(quantity__gt=0).values(
                'id', 'book_name', 'quantity', 'auth', 'tag', 'description', 'bookimages__book_image', 'enter_book'
            ).annotate(book_image=F('bookimages__book_image'))

            books_info = []
            for book in books_with_images:
                book_dict = {
                    'id': book['id'],
                    'book_name': book['book_name'],
                    'quantity': book['quantity'],
                    'auth': book['auth'],
                    'tag': book['tag'],
                    'description': book['description'],
                }
                

                # Convert binary image data to base64 string
                binary_image = book['book_image']
                if binary_image:
                    base64_image = base64.b64encode(binary_image).decode('utf-8')
                    book_dict['book_image'] = base64_image
                else:
                    book_dict['book_image'] = None

                books_info.append(book_dict)

            return JsonResponse({'books_info': books_info}, safe=False)

        except Exception as e:
            print(f"Error executing query: {e}")
            return JsonResponse({'error': 'Error executing query'}, status=500)

class BooksByTag(APIView):
    def get(self, request):
        tag = request.GET.get('tag')

        if not tag:
            return JsonResponse({'error': 'Tag not provided'}, status=400)

        try:
            books_with_images = Books.objects.filter(tag=tag).values(
                'id', 'book_name', 'quantity', 'auth', 'tag', 'description', 'bookimages__book_image'
            ).annotate(book_image=F('bookimages__book_image'))


            books_list = []
            for book in books_with_images:
                book_dict = {
                    'id': book['id'],
                    'book_name': book['book_name'],
                    'quantity': book['quantity'],
                    'auth': book['auth'],
                    'tag': book['tag'],
                    'description': book['description'],
                }

                # Convert binary image data to base64 string
                binary_image = book['book_image']
                if binary_image:
                    base64_image = base64.b64encode(binary_image).decode('utf-8')
                    book_dict['book_image'] = base64_image
                else:
                    book_dict['book_image'] = None

                books_list.append(book_dict)

            # Return the JSON response with books information
            return JsonResponse({'books_list': books_list}, safe=False)

        except Exception as e:
            print(f"Error executing query: {e}")
            return JsonResponse({'error': 'Error executing query'}, status=500)

class EditUserView(APIView):
    
    def post(self, request):
        try:
            uid = request.data.get('uid')
            name = request.data.get('name')
            email = request.data.get('email')
            user_id = request.data.get('id')
            birth_date = request.data.get('birth')
            gender = request.data.get('gender')
            class_name = request.data.get('class_name')
            faculty_name = request.data.get('fid')
            avatar_file = request.FILES.get('avatar')

            # Kiểm tra uid có tồn tại không
            if not uid:
                return Response({'error': 'UID not provided'}, status=400)

            user = Users.objects.get(uid=uid)

            # Tìm `cid` dựa trên `class_name` và `faculty_name`
            class_obj = Classes.objects.select_related('fid').filter(
                class_name=class_name,
                fid__faculty_name=faculty_name
            ).first()

            if not class_obj:
                return Response({'error': 'Class not found for the provided class_name and faculty_name'}, status=404)
                
            user.name = name
            user.email = email
            user.id = user_id
            user.birth = birth_date
            user.gender = gender
            user.cid = class_obj
            user.save()

            if avatar_file:
                avatar, created = Avatars.objects.get_or_create(uid=user)
                avatar.image = avatar_file.read()
                avatar.save()

            return Response({'message': 'User info updated successfully'})

        except Exception as e:
            error_message = f"Error updating user info: {e}"
            print(error_message)
            return Response({'error': error_message}, status=500)

    def get(self, request):
        return Response({'error': 'Method not allowed'}, status=405)

class SearchBooks(APIView):
    def get(self, request):
        query = request.GET.get('query', '')

        if query:
            try:
                books_with_images = Books.objects.filter(
                    Q(book_name__icontains=query) | Q(auth__icontains=query)
                ).values(
                    'id', 'book_name', 'quantity', 'auth', 'tag', 'description', 'bookimages__book_image'
                ).annotate(book_image=F('bookimages__book_image'))

                books_list = []
                for book in books_with_images:
                    book_dict = {
                        'id': book['id'],
                        'book_name': book['book_name'],
                        'quantity': book['quantity'],
                        'auth': book['auth'],
                        'tag': book['tag'],
                        'description': book['description'],
                    }

                    binary_image = book['book_image']
                    if binary_image:
                        base64_image = base64.b64encode(binary_image).decode('utf-8')
                        book_dict['book_image'] = base64_image
                    else:
                        book_dict['book_image'] = None

                    books_list.append(book_dict)

                return JsonResponse({'books': books_list})

            except Exception as e:
                print(f"Error executing query: {e}")
                return JsonResponse({'error': 'Error executing query'}, status=500)

        return JsonResponse({'books': []})

class SortBooks(APIView):
    def get(self, request):
        sort_option = request.GET.get('sortOption', '')

        if sort_option == 'name-asc':
            order_by = 'book_name'
        elif sort_option == 'name-desc':
            order_by = '-book_name'
        elif sort_option == 'quantity-asc':
            order_by = 'quantity'
        elif sort_option == 'quantity-desc':
            order_by = '-quantity'
        else:
            return JsonResponse({'books': []})

        try:
            books_with_images = Books.objects.values(
                'id', 'book_name', 'auth', 'quantity', 'description', 'tag', 'bookimages__book_image'
            ).annotate(book_image=F('bookimages__book_image')).order_by(order_by)

            # Convert the query result into a list of dictionaries
            books_list = []
            for book in books_with_images:
                book_dict = {
                    'id': book['id'],
                    'book_name': book['book_name'],
                    'auth': book['auth'],
                    'quantity': book['quantity'],
                    'description': book['description'],
                    'tag': book['tag'],
                }
                binary_image = book['book_image']
                if binary_image:
                    base64_image = base64.b64encode(binary_image).decode('utf-8')
                    book_dict['book_image'] = base64_image
                else:
                    book_dict['book_image'] = None

                books_list.append(book_dict)

            return JsonResponse({'books': books_list})

        except Exception as e:
            print(f"Error executing query: {e}")
            return JsonResponse({'error': 'Error executing query'}, status=500)


class ViewBorrowBooks(APIView):
    def get(self, request):
        uid = request.GET.get('uid')

        if not uid:
            print("UID not provided")
            return JsonResponse({'error': 'UID not provided'}, status=400)

        try:
            borrow_books = Cards.objects.filter(sid=uid).values(
                'bid__id', 'bid__book_name', 'day_borrow', 'day_return', 'limit_day'
            )

            if not borrow_books.exists():
                print(f"No records found for UID: {uid}")
                return JsonResponse({'message': 'No records found'}, status=200)

            borrow_book_info_list = []
            for book in borrow_books:
                borrow_book_info = {
                    'id': book['bid__id'],
                    'book_name': book['bid__book_name'],
                    'day_borrow': book['day_borrow'],
                    'day_return': book['day_return'],
                    'limit_day': book['limit_day'],
                }
                borrow_book_info_list.append(borrow_book_info)

            return JsonResponse(borrow_book_info_list, safe=False)

        except Exception as e:
            print(f"Error fetching borrow book info: {e}")
            return JsonResponse({'error': 'Error fetching borrow book info'}, status=500)


class SaveBookView(APIView):
    def post(self, request):
        try:
            # Lấy dữ liệu từ request
            id = request.data.get('id')
            book_name = request.data.get('book_name')
            quantity = request.data.get('quantity')
            author = request.data.get('author')
            tag = request.data.get('tag')
            description = request.data.get('description')
            book_image = request.FILES.get('book_image') 
            if not all([id, book_name, quantity, author, tag, description, book_image]):
                return Response({"success": False, "message": "All book details must be provided."}, status=status.HTTP_400_BAD_REQUEST)


            with transaction.atomic():
                current_time_vietnam = timezone.localtime(timezone.now())

            
                print("time",current_time_vietnam)
                # Lưu thông tin sách vào database
                book = Books.objects.create(
                    id=id,
                    book_name=book_name,
                    quantity=quantity,
                    auth=author,
                    tag=tag,
                    description=description,
                    enter_book=current_time_vietnam
                )
                print("time sau",book.enter_book)
                # Lưu ảnh sách vào database
                Bookimages.objects.create(
                    bid=book,
                    book_image=book_image.read()
                )

            return Response({"success": True, "message": "Book and image saved successfully."}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return Response({"success": False, "message": f"Internal Server Error: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class DeleteBooks(APIView):
    def post(self, request):
        try:
            data = request.data
            book_ids = data.get('ids', [])
            
            if not book_ids:
                return JsonResponse({"success": False, "message": "No book IDs provided."}, status=status.HTTP_400_BAD_REQUEST)
            
            with transaction.atomic():
                Bookimages.objects.filter(bid__in=book_ids).delete()
                
                Books.objects.filter(id__in=book_ids).delete()
            
            return JsonResponse({"success": True, "message": "Books and related images deleted successfully."}, status=status.HTTP_200_OK)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
class GetUserInfo(APIView):
    def get(self, request):
        try:
            uid = request.GET.get('uid')

            # Kiểm tra uid có tồn tại không
            if not uid:
                return Response({'error': 'UID not provided'}, status=status.HTTP_400_BAD_REQUEST)

            user = get_object_or_404(Users.objects.select_related('cid', 'cid__fid'), uid=uid)

            avatar_data = Avatars.objects.filter(uid=user).first()

            # Nếu có dữ liệu ảnh, chuyển đổi nó sang Base64
            avatar_base64 = None
            if avatar_data and avatar_data.image:
                avatar_base64 = base64.b64encode(avatar_data.image).decode('utf-8')

            user_info = {
                'uid': user.uid,
                'name': user.name,
                'email': user.email,
                'id': user.id,
                'birth': user.birth,
                'gender': user.gender,
                'fid': user.cid.fid.faculty_name if user.cid and user.cid.fid else None,
                'is_admin': user.isadmin,
                'class_name': user.cid.class_name if user.cid else None,
                'avatar': avatar_base64,
            }

            # Trả về thông tin người dùng dưới dạng JSON
            return Response(user_info, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error fetching user info: {e}") 
            return Response({'error': 'Error fetching user info'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class GetBookInfo(APIView):
    def get(self, request):
        try:
            book_id = request.GET.get('bookId')
           
            if not book_id:
                return JsonResponse({'error': 'Book ID not provided'}, status=400)

            book = Books.objects.filter(id=book_id).first()

            if not book:
                return JsonResponse({'error': 'Book not found'}, status=404)

            # Truy vấn ORM để lấy ảnh của sách (nếu có)
            book_image = None
            book_image_obj = Bookimages.objects.filter(bid=book_id).first()
            if book_image_obj:
                book_image = book_image_obj.book_image

            # Chuyển đổi ảnh sang chuỗi base64 nếu có
            image_base64 = None
            if book_image:
                image_base64 = base64.b64encode(book_image).decode('utf-8')

            book_info = {
                'book_id': book.id,
                'book_name': book.book_name,
                'auth': book.auth,
                'quantity': book.quantity,
                'tag': book.tag,
                'description': book.description,
                'book_image': image_base64,
            }

            return JsonResponse(book_info)

        except Exception as e:
            return JsonResponse({'error': 'Error fetching book info'}, status=500)


class EditBook(APIView):
    def post(self, request):
        try:
            book_id = request.data.get('book_id')
            book_name = request.data.get('book_name')
            author = request.data.get('auth')
            quantity = request.data.get('quantity')
            tag = request.data.get('tag')
            description = request.data.get('description')
            book_image = request.FILES.get('book_image')
            
            # Kiểm tra xem book_id có tồn tại không
            if not book_id:
                return Response({'error': 'Book ID not provided'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Cập nhật thông tin sách
            book = Books.objects.get(id=book_id)
            book.book_name = book_name
            book.auth = author
            book.quantity = quantity
            book.tag = tag
            book.description = description
            book.save()
            
            # Cập nhật ảnh sách nếu có
            if book_image:
                print("ảnh")
                book_image_obj = Bookimages.objects.get(bid=book_id)
                book_image_obj.book_image = book_image.read()
                book_image_obj.save()
            
            return Response({"success": True, "message": "Book edited successfully."}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': f'Error editing book: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



class SearchBooksDTB(APIView):
    def get(self, request):
        search_query = request.GET.get('searchQuery', '')
        username = request.GET.get('username')
        
        print("search username: ", username)
        
        if not search_query:
            return JsonResponse({'error': 'searchQuery is required'}, status=400)

        try:
            books = Books.objects.filter(book_name__icontains=search_query, cards__sid=username)
            
            results = []
            for book in books:
                results.append({
                    'id': book.id,
                    'book_name': book.book_name,
                    'day_borrow': book.cards.day_borrow,
                    'day_return': book.cards.day_return,
                    'limit_day': book.cards.limit_day,
                })

            return JsonResponse(results, safe=False)

        except Exception as e:
            print(f"Error processing request: {e}")
            return JsonResponse({'error': 'Error processing request'}, status=500)

class GetBooksCount(APIView):
    def get(self, request):
        try:
            date = request.GET.get('date', None)

            date_condition = {}
            if date:
                date_condition['enter_book__lt'] = date

            result = Books.objects.filter(**date_condition).aggregate(total_books=Count('id'), total_quantity=Sum('quantity'))

            return JsonResponse({
                'total_books': result['total_books'], 
                'total_quantity': result['total_quantity'] if result['total_quantity'] is not None else 0
            })

        except Exception as e:
            print(f"Error executing query: {e}")
            return JsonResponse({'error': 'Error executing query'}, status=500)





class GetCheckinCount(APIView):
    def get(self, request):
        try:
            selected_date = request.GET.get('date', None)
            condition = {}
            if selected_date:
                # Chuyển đổi chuỗi datetime ISO 8601 thành đối tượng datetime
                selected_datetime = parse_datetime(selected_date)
                if selected_datetime:
                    # Đảm bảo datetime là aware (có múi giờ UTC)
                    if is_naive(selected_datetime):
                        selected_datetime = make_aware(selected_datetime, timezone=utc)
                    
                
                    condition['time_out__lt'] = selected_datetime
                   

            count = Checkin.objects.filter(**condition).count()

            return JsonResponse({'total_checkin': count}, safe=False)

        except Exception as e:
            traceback.print_exc()
            error_message = f"Error executing query: {e}"
            return JsonResponse({'error': error_message}, status=500)



class GetBorrowBookCount(APIView):
    def get(self, request):
        try:           
            selected_date = request.GET.get('date', None)
            
            condition = {}
            if selected_date:
                condition['day_borrow__lt'] = selected_date
            
            count = Cards.objects.filter(**condition).values('bid').distinct().count()

          
            return JsonResponse({'total_borrow_book': count}, safe=False)

        except Exception as e:
            error_message = f"Error executing query: {e}"
            return JsonResponse({'error': error_message}, status=500)


class GetCategoriesAndCounts(APIView):
    def get(self, request):
        try:
            
            date = request.GET.get('date', None)

            condition = {}
            if date:
                condition['enter_book__lt'] = date

            categories = Books.objects.filter(**condition).values('tag').annotate(count=Count('tag'))
            categories_list = [{'tag': category['tag'], 'count': category['count']} for category in categories]
            return JsonResponse({'categories': categories_list}, safe=False)

        except Exception as e:
            print("Error executing query:", e)
            return JsonResponse({'error': 'Error executing query'}, status=500)


from django.db.models import Q, F, ExpressionWrapper, DateTimeField


from django.db.models import Q, F, ExpressionWrapper, DateTimeField
from django.utils import timezone
from django.utils.dateparse import parse_date
from rest_framework.views import APIView
from django.http import JsonResponse
from .models import Users
import traceback
from datetime import timedelta
from django.http import JsonResponse
from django.views.generic import View
from .models import Users, Classes, Cards, Faculties
from datetime import datetime, timedelta
from django.db.models import Q, F, ExpressionWrapper, DurationField
from django.utils import timezone

from django.http import JsonResponse
from django.views.generic import View
from .models import Users, Classes, Cards, Faculties
from datetime import datetime, timedelta
from django.utils import timezone
from django.db.models.functions import Cast, ExtractDay
from django.db.models import Q, F, ExpressionWrapper, DateTimeField, IntegerField  # Import IntegerField

class UserCheckingData(APIView):
    def get(self, request):
        try:
            print("Hàm data")
            selected_date = request.GET.get('date') 
            if selected_date:
                selected_date = selected_date.replace('T', ' ')
                print("giờ lấy xuống backend sau fix", selected_date)
            
    
            sql = """
                SELECT
                    users.uid,
                    users.name,
                    users.email,
                    users.id,
                    users.gender,
                    users.birth,
                    classes.class_name,
                    c.day_borrow,
                    c.limit_day,
                    f.faculty_name
                FROM
                    Users AS users
                JOIN
                    Classes AS classes ON users.cid = classes.cid
                JOIN 
                    Cards AS c ON c.sid = users.uid
                JOIN
                    Faculties AS f ON f.fid= classes.fid
                WHERE
                    users.isAdmin = 0
                    AND (c.day_return IS NULL OR DATE_ADD(c.day_borrow, INTERVAL c.limit_day DAY) < c.day_return)
                    AND DATE_ADD(c.day_borrow, INTERVAL c.limit_day DAY) < NOW()
                    AND (c.day_borrow < %s) 
                GROUP BY
                    users.uid, users.name, users.email, users.id, users.gender, users.birth, classes.class_name, f.faculty_name;
            """

            with connections['default'].cursor() as cursor:
                cursor.execute(sql, [selected_date])  # Truyền selected_date vào câu lệnh SQL
                data = cursor.fetchall()

            results = []
            for row in data:
                results.append({
                    'uid': row[0],
                    'name': row[1],
                    'email': row[2],
                    'id': row[3],
                    'gender': row[4],
                    'birth': row[5],
                    'class_name': row[6],
                    'day_borrow':row[7],
                    'limit_day':row[8],
                    'faculty_name': row[9]
                })

            row_count = len(results)

            return JsonResponse({'results': results, 'row_count': row_count}, safe=False)

        except Exception as e:
            error_message = "Error executing query: {}".format(e)
            return JsonResponse({'error': error_message}, status=500)
