import base64
from django.http import HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connections
import json
import logging
@csrf_exempt
def account_view(request):
    if request.content_type == 'application/json':
        data = json.loads(request.body)
        username = data.get('usernameTxt')
        password = data.get('passwordTxt')
        print(request.POST)


        with connections['default'].cursor() as cursor:
            sql = "SELECT * FROM Accounts WHERE username = %s AND password = %s"
            cursor.execute(sql, [username, password])
            
            data = cursor.fetchall()
        
        if data:
            return JsonResponse('Success', safe=False)
        else:
            return JsonResponse('Failed', safe=False)
    else:
        return JsonResponse('Method not allowed', status=405)
@csrf_exempt

def user_list_view(request):
    # Kiểm tra nếu phương thức yêu cầu là GET
    if request.method == 'GET':
        try:
            # Truy vấn SQL để lấy dữ liệu từ cơ sở dữ liệu
            sql = """
            SELECT
                users.uid,
                users.name,
                users.email,
                users.id,
                users.gender,
                users.birth,
                classes.class_name,
                ci.time_in,
                ci.time_out
            FROM
                Users AS users
            JOIN
                Classes AS classes ON users.cid = classes.cid
            JOIN
                CheckIn AS ci ON users.uid = ci.uid
            WHERE
                users.isAdmin = 0;
            """

            with connections['default'].cursor() as cursor:
                cursor.execute(sql)
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
                    'time_in': row[7],
                    'time_out': row[8],
                })

            # Trả về phản hồi JSON chứa dữ liệu
            return JsonResponse(results, safe=False)

        except Exception as e:
            print("Error executing query:", e)
            return JsonResponse({'error': 'Error executing query'}, status=500)
    
    return HttpResponseBadRequest("Method not allowed")

@csrf_exempt
def user_search_view(request):
    if request.method == 'GET':
        search_query = request.GET.get('searchQuery', '')

        if not search_query:
            return JsonResponse({'error': 'searchQuery is required'}, status=400)

        sql = """
        SELECT
            users.uid,
            users.name,
            users.email,
            users.id,
            users.gender,
            users.birth,
            classes.class_name,
            ci.time_in,
            ci.time_out
        FROM
            Users AS users
        JOIN
            Classes AS classes ON users.cid = classes.cid
        JOIN
            CheckIn AS ci ON users.uid = ci.uid
        WHERE
            users.isAdmin = 0 AND
            (users.uid LIKE %s OR users.name LIKE %s);
        """

        try:
            with connections['default'].cursor() as cursor:
                cursor.execute(sql, [f'%{search_query}%', f'%{search_query}%'])
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
                    'time_in': row[7],
                    'time_out': row[8],
                })

            # Return the list of dictionaries as a JSON response
            return JsonResponse(results, safe=False)

        except Exception as e:
            print(f"Error processing request: {e}")
            return JsonResponse({'error': 'Error processing request'}, status=500)

    return HttpResponseBadRequest("Method not allowed")

@csrf_exempt
def user_delete_view(request):
    if request.method == 'DELETE':
        try:
            data = json.loads(request.body)
            uids = data.get('uids')

            if not uids or not isinstance(uids, list):
                return JsonResponse({'error': 'No uids provided or uids is not a list'}, status=400)

            with connections['default'].cursor() as cursor:
                for uid in uids:
                    cursor.execute("DELETE FROM CheckIn WHERE uid = %s", [uid])
                    cursor.execute("DELETE FROM Cards WHERE sid = %s", [uid])
                    cursor.execute("DELETE FROM Accounts WHERE username = %s", [str(uid)])
                    cursor.execute("DELETE FROM Users WHERE uid = %s", [uid])

            return JsonResponse({'message': 'Records deleted successfully'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            print(f"Error processing request: {e}")
            return JsonResponse({'error': 'An error occurred while processing the request'}, status=500)

    return HttpResponseBadRequest("Method not allowed")
def get_cid_view(request):
    if request.method == 'GET':
        try:
            sql = "SELECT cid FROM Classes"

            with connections['default'].cursor() as cursor:
                cursor.execute(sql)
                data = cursor.fetchall()

                cid_list = [{'value': row[0], 'text': f'{row[0]}'} for row in data]


            return JsonResponse({'cids': cid_list}, safe=False)

        except Exception as e:
            print("Error executing query:", e)
            return JsonResponse({'error': 'Error executing query'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
def get_cid_view(request):
    if request.method == 'GET':
        try:
            sql = "SELECT cid FROM Classes"

            with connections['default'].cursor() as cursor:
                cursor.execute(sql)
                data = cursor.fetchall()

                cid_list = [{'value': row[0], 'text': f'{row[0]}'} for row in data]


            return JsonResponse({'cids': cid_list}, safe=False)

        except Exception as e:
            print("Error executing query:", e)
            return JsonResponse({'error': 'Error executing query'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def get_classes_view(request):
    print("class nè")
    if request.method == 'POST':
        try:
            # Nhận dữ liệu JSON từ body của yêu cầu
            data = json.loads(request.body)
            selected_cid = data.get('cid')

            if not selected_cid:
                return JsonResponse({'error': 'CID is required'}, status=400)

            sql = """
            SELECT class_name
            FROM Classes
            WHERE cid = %s;
            """
            
            with connections['default'].cursor() as cursor:
                cursor.execute(sql, [selected_cid])
                result = cursor.fetchall()
            
            class_list = [{'value': class_name, 'text': class_name} for (class_name,) in result]
            
            return JsonResponse({'classes': class_list})
        
        except Exception as e:
            print("Error:", e)
            return JsonResponse({'error': 'Error processing request'}, status=500)
    

    return JsonResponse({'error': 'Method not allowed'}, status=405)
# Tạo logger
logger = logging.getLogger(__name__)

@csrf_exempt

def save_user_view(request):
    if request.method == 'POST':
        try:
            uid = request.POST.get('uid')
            name = request.POST.get('name')
            email = request.POST.get('email')
            user_id = request.POST.get('id')
            birth_date = request.POST.get('birthDate')
            gender = request.POST.get('gender')
            cid = request.POST.get('cid')
            avatar_file = request.FILES.get('avatar')  # Đọc file ảnh từ request.FILES

            if gender == 'male':
                gender = 1  # Nam
            elif gender == 'female':
                gender = 0  # Nữ
            else:
                return JsonResponse({'error': 'Invalid gender value'}, status=400)

            insert_user_sql = """
                INSERT INTO Users (uid, name, email, id, birth, gender, cid, isAdmin)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            """
            insert_avatar_sql = """
                INSERT INTO Avatars (uid, image)
                VALUES (%s, %s)
            """

            with connections['default'].cursor() as cursor:
                cursor.execute(insert_user_sql, (uid, name, email, user_id, birth_date, gender, cid, 0))

                # Nếu có file ảnh, chèn dữ liệu vào bảng Avatars
                if avatar_file:
                    # Đọc dữ liệu ảnh
                    avatar_data = avatar_file.read()

                    # Thực hiện truy vấn
                    cursor.execute(insert_avatar_sql, (uid, avatar_data))

            return JsonResponse({'message': 'User and avatar saved successfully'})

        except Exception as e:
            # Ghi nhật ký lỗi
            logger.error(f"Error saving user data: {e}")
            return JsonResponse({'error': 'Error saving user data'}, status=500)

    # Trả về lỗi nếu phương thức không phải là POST
    return JsonResponse({'error': 'Method not allowed'}, status=405)


@csrf_exempt
def save_account_view(request):
    if request.method == 'POST':
        data = json.loads(request.body)

        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return JsonResponse({'error': 'Username and password are required'}, status=400)

        sql = """
            INSERT INTO Accounts (username, password,role)
            VALUES (%s, %s,%s)
        """
        try:
            with connections['default'].cursor() as cursor:
                cursor.execute(sql, (username, password,0))
            
            return JsonResponse({'message': 'Account saved successfully'})

        except Exception as e:
            print(f"Error saving account data: {e}")
            return JsonResponse({'error': 'Error saving account data'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def get_avatar_url_view(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            uid = data.get('sr')
            
            if not uid:
                return JsonResponse({'error': 'UID is required'}, status=400)
            
            sql = "SELECT image FROM Avatars WHERE uid = %s"
            
            with connections['default'].cursor() as cursor:
                cursor.execute(sql, [uid])
                result = cursor.fetchone()
            
            if result:
                # Lấy dữ liệu nhị phân của ảnh từ kết quả truy vấn
                binary_image = result[0]

                # Chuyển đổi dữ liệu nhị phân thành chuỗi base64
                base64_image = base64.b64encode(binary_image).decode('utf-8')

                # Trả về phản hồi JSON chứa chuỗi base64 của ảnh
                return JsonResponse({'avatar_url': base64_image})
            else:
                # Trả về lỗi nếu không tìm thấy dữ liệu ảnh
                return JsonResponse({'error': 'Avatar not found'}, status=404)
          
        
        except Exception as e:
            print(f"Error fetching avatar URL: {e}")
            return JsonResponse({'error': 'Error fetching avatar URL'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)