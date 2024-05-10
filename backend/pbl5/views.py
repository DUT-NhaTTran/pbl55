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

        with connections['default'].cursor() as cursor:
            sql = "SELECT username, role FROM Accounts WHERE username = %s AND password = %s"
            cursor.execute(sql, [username, password])
            result = cursor.fetchone()

        if result:
            db_username, role = result
            # Trả về JSON chứa username và role cùng với message
            return JsonResponse({
                'message': 'Success',
                'username': db_username,
                'role': role
            })
        else:
             return JsonResponse({
                'message': 'Fail',
              
            })
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)

@csrf_exempt


def account_change_view(request):
    if request.content_type == 'application/json':
        try:
            # Tải dữ liệu JSON từ yêu cầu
            data = json.loads(request.body)
            username = data.get('usernameTxt')
            password = data.get('passwordTxt')
            newpassword = data.get('newpasswordTxt')
            reenterpassword = data.get('reenterpasswordTxt')
            
            # In ra thông tin đầu vào (nếu cần)
            print('Thông tin:', username, password, newpassword, reenterpassword)

            # Kết nối với cơ sở dữ liệu và thực hiện truy vấn
            with connections['default'].cursor() as cursor:
                sql = "UPDATE Accounts SET password = %s WHERE username = %s AND password = %s"
                cursor.execute(sql, [newpassword, username, password])
                
                if cursor.rowcount > 0:
                    return JsonResponse('Success', safe=False)
                else:
                    return JsonResponse('Failed', safe=False)

        except Exception as e:
            return JsonResponse({'message': f'An error occurred: {str(e)}'}, status=500)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=405)



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
def get_fid_view(request):
    if request.method == 'GET':
        try:
            sql = "SELECT faculty_name FROM Faculties"

            with connections['default'].cursor() as cursor:
                cursor.execute(sql)
                data = cursor.fetchall()

                fid_list = [{'value': row[0], 'text': f'{row[0]}'} for row in data]


            return JsonResponse({'fids': fid_list}, safe=False)

        except Exception as e:
            print("Error executing query:", e)
            return JsonResponse({'error': 'Error executing query'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
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
            selected_fid = data.get('fid')

            if not selected_fid:
                return JsonResponse({'error': 'FID is required'}, status=400)

            sql = """
            SELECT Classes.class_name
            FROM Classes
            JOIN Faculties 
            WHERE Faculties.fid = Classes.fid AND Faculties.faculty_name = %s;
            """
            
            with connections['default'].cursor() as cursor:
                cursor.execute(sql, [selected_fid])
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

def     save_user_view(request):
    if request.method == 'POST':
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

            # Chuyển đổi giá trị giới tính thành số
            if gender == 'male' or gender == '1':
                gender = 1
            elif gender == 'female' or gender == '0':
                gender = 0
            else:
                logger.warning(f"Invalid gender value: {gender}")
                return JsonResponse({'error': 'Invalid gender value'}, status=400)

            # Tìm `cid` dựa trên `class_name` và `faculty_name`
            find_cid_sql = """
                SELECT cid
                FROM Classes
                JOIN Faculties ON Classes.fid = Faculties.fid
                WHERE Classes.class_name = %s AND Faculties.faculty_name = %s
            """
            with connections['default'].cursor() as cursor:
                cursor.execute(find_cid_sql, (class_name, faculty_name))
                result = cursor.fetchone()
                
                # Kiểm tra kết quả tìm `cid`
                if not result:
                    return JsonResponse({'error': 'Class not found for the provided class_name and faculty_name'}, status=400)
                
                # Lấy `cid` từ kết quả
                cid = result[0]

                # Thực hiện truy vấn để lưu người dùng
                insert_user_sql = """
                    INSERT INTO Users (uid, name, email, id, birth, gender, cid, isAdmin)
                    VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                """
                cursor.execute(insert_user_sql, (uid, name, email, user_id, birth_date, gender, cid, 0))

                # Nếu có avatar, lưu vào bảng `Avatars`
                if avatar_file:
                    avatar_data = avatar_file.read()
                    insert_avatar_sql = """
                        INSERT INTO Avatars (uid, image)
                        VALUES (%s, %s)
                    """
                    cursor.execute(insert_avatar_sql, (uid, avatar_data))

            return JsonResponse({'message': 'User and avatar saved successfully'})

        except Exception as e:
            # Ghi nhật ký lỗi
            logger.error(f"Error saving user data: {e}")
            return JsonResponse({'error': f"Error saving user data: {e}"}, status=500)



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
@csrf_exempt

def get_catagories_view(request):
    if request.method == 'GET':
        try:
            sql = "SELECT distinct tag FROM Books"

            with connections['default'].cursor() as cursor:
                cursor.execute(sql)
                data = cursor.fetchall()

                tag_list = [{'value': row[0], 'text': f'{row[0]}'} for row in data]


            return JsonResponse({'tags': tag_list}, safe=False)

        except Exception as e:
            print("Error executing query:", e)
            return JsonResponse({'error': 'Error executing query'}, status=500)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt

def get_books_info(request):
    if request.method == 'GET':
        try:
            sql = """
                SELECT 
                    Books.id,
                    Books.book_name,
                    Books.quantity,
                    Books.auth,
                    Books.tag,
                    Books.description,
                    BookImages.book_image  
                FROM Books
                JOIN BookImages ON Books.id = BookImages.bid  
            """

            with connections['default'].cursor() as cursor:
                cursor.execute(sql)
                data = cursor.fetchall()

            books_info = []
            for row in data:
                book_dict = {
                    'id': row[0],
                    'book_name': row[1],
                    'quantity': row[2],
                    'auth': row[3],
                    'tag': row[4],
                    'description': row[5],
                }

                # Lấy dữ liệu hình ảnh
                binary_image = row[6]
                if binary_image and len(binary_image) > 0:
                    base64_image = base64.b64encode(binary_image).decode('utf-8')
                    book_dict['book_image'] = base64_image
                else:
                    book_dict['book_image'] = None

                books_info.append(book_dict)
            
            return JsonResponse({'books_info': books_info}, safe=False)

        except Exception as e:
            print(f"Error executing query: {e}")
            return JsonResponse({'error': 'Error executing query'}, status=500)
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def books_by_tag(request):
    if request.method == 'GET':
        tag = request.GET.get('tag')

        if not tag:
            return JsonResponse({'error': 'Tag not provided'}, status=400)

        try:
            # Truy vấn SQL để lấy sách theo tag
            sql = """
                SELECT
                    Books.id,
                    Books.book_name,
                    Books.quantity,
                    Books.auth,
                    Books.tag,
                    Books.description,
                    BookImages.book_image
                FROM
                    Books
                JOIN
                    BookImages ON Books.id = BookImages.bid
                WHERE
                    Books.tag = %s
            """

            with connections['default'].cursor() as cursor:
                cursor.execute(sql, [tag])
                data = cursor.fetchall()

            books_list = []
            for row in data:
                book_dict = {
                    'id': row[0],
                    'book_name': row[1],
                    'quantity': row[2],
                    'auth': row[3],
                    'tag': row[4],
                    'description': row[5],
                }

                binary_image = row[6]
                if binary_image:
                    base64_image = base64.b64encode(binary_image).decode('utf-8')
                    book_dict['book_image'] = base64_image
                else:
                    book_dict['book_image'] = None

                books_list.append(book_dict)
            
            return JsonResponse({'books_list': books_list}, safe=False)

        except Exception as e:
            print(f"Error executing query: {e}")
            return JsonResponse({'error': 'Error executing query'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def get_user_info(request):
    if request.method == 'GET':
        try:
            uid = request.GET.get('uid')

            # Kiểm tra uid có tồn tại không
            if not uid:
                return JsonResponse({'error': 'UID not provided'}, status=400)

            get_user_sql = """
                SELECT u.uid, u.name, u.email, u.id, u.birth, u.gender, f.faculty_name, u.isAdmin, c.class_name, a.image
                FROM Users u
                LEFT JOIN Avatars a ON u.uid = a.uid
                LEFT JOIN Classes c ON u.cid = c.cid
                LEFT JOIN Faculties f ON c.fid = f.fid
                WHERE u.uid = %s
            """


            with connections['default'].cursor() as cursor:
                cursor.execute(get_user_sql, [uid])
                row = cursor.fetchone()  # Lấy một hàng dữ liệu từ truy vấn

                # Kiểm tra hàng dữ liệu nhận được
                if not row:
                    logger.warning(f"User not found with UID: {uid}")
                    return JsonResponse({'error': 'User not found'}, status=404)

                # Phân tách dữ liệu từ hàng dữ liệu
                uid, name, email, user_id, birth_date, gender, fid, is_admin,class_name, avatar_data= row

                # Nếu có dữ liệu ảnh, chuyển đổi nó sang Base64
                avatar_base64 = None
                if avatar_data:
                    avatar_base64 = base64.b64encode(avatar_data).decode('utf-8')

                user_info = {
                    'uid': uid,
                    'name': name,
                    'email': email,
                    'id': user_id,
                    'birth': birth_date,
                    'gender': gender,
                    'fid': fid,
                    'is_admin': is_admin,
                    'class_name':class_name,
                    'avatar': avatar_base64,
                }

                # Trả về thông tin người dùng dưới dạng JSON
                return JsonResponse(user_info)


        except Exception as e:
            # Ghi nhật ký lỗi
            logger.error(f"Error fetching user info: {e}")
            return JsonResponse({'error': 'Error fetching user info'}, status=500)

    # Trả về lỗi nếu phương thức không phải là GET
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def edit_user_view(request):
    if request.method == 'POST':
        try:
           
            uid = request.POST.get('uid')
            print('uid nè ',uid)
            name = request.POST.get('name')
            email = request.POST.get('email')
            user_id = request.POST.get('id')
            birth_date = request.POST.get('birth')
            gender = request.POST.get('gender')
            class_name = request.POST.get('class_name')
            faculty_name = request.POST.get('fid')
            avatar_file = request.FILES.get('avatar')
           
            
            # Kiểm tra uid có tồn tại không
            if not uid:
                return JsonResponse({'error': 'UID not provided'}, status=400)

            # Tìm `cid` dựa trên `class_name` và `faculty_name`
            find_cid_sql = """
                SELECT cid
                FROM Classes
                JOIN Faculties ON Classes.fid = Faculties.fid
                WHERE Classes.class_name = %s AND Faculties.faculty_name = %s
            """
            
            with connections['default'].cursor() as cursor:
                cursor.execute(find_cid_sql, [class_name, faculty_name])
                result = cursor.fetchone()
                
                # Kiểm tra kết quả tìm `cid`
                if not result:
                    return JsonResponse({'error': 'Class not found for the provided class_name and faculty_name'}, status=404)
                
                # Lấy `cid` từ kết quả
                cid = result[0]
                print("cid nè :",cid)

            # Cập nhật thông tin người dùng
            update_user_sql = """
                UPDATE Users
                SET name = %s,
                    email = %s,
                    id = %s,
                    birth = %s,
                    gender = %s,
                    cid = %s
                WHERE uid = %s
            """

            with connections['default'].cursor() as cursor:
                cursor.execute(update_user_sql, [name, email, user_id, birth_date, gender, cid, uid])

            # Cập nhật avatar nếu có
            if avatar_file:
                # Đọc dữ liệu tệp
                avatar_data = avatar_file.read()
                
                # Thực hiện truy vấn để cập nhật ảnh đại diện
                update_avatar_sql = """
                   UPDATE Avatars
                        SET image = %s
                        WHERE uid = %s
                """
                with connections['default'].cursor() as cursor:
                    cursor.execute(update_avatar_sql, [ avatar_data,uid])

            return JsonResponse({'message': 'User info updated successfully'})

        except Exception as e:
            logger.error(f"Error updating user info: {e}")
            return JsonResponse({'error': 'Error updating user info'}, status=500)

    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def search_books(request):
    query = request.GET.get('query', '')

    if query:
        # Truy vấn SQL để tìm sách và hình ảnh sách dựa trên book_name hoặc auth chứa query
        sql_query = """
        SELECT
            Books.id,
            Books.book_name,
            Books.quantity,
            Books.auth,
            Books.tag,
            Books.description,
            BookImages.book_image
        FROM
            Books
        JOIN
            BookImages ON Books.id = BookImages.bid
        WHERE
            Books.book_name LIKE %s OR Books.auth LIKE %s;
        """

        # Mở kết nối và thực hiện truy vấn
        with connections['default'].cursor() as cursor:
            cursor.execute(sql_query, (f"%{query}%", f"%{query}%"))
            
            # Lấy tất cả kết quả
            books = cursor.fetchall()

            # Chuyển đổi kết quả thành danh sách từ điển
            books_list = []
            for row in books:
                book_dict = {
                    'id': row[0],
                    'book_name': row[1],
                    'quantity': row[2],
                    'auth': row[3],
                    'tag': row[4],
                    'description': row[5],
                }

                binary_image = row[6]
                if binary_image:
                    # Mã hóa hình ảnh thành chuỗi base64
                    base64_image = base64.b64encode(binary_image).decode('utf-8')
                    book_dict['book_image'] = base64_image
                else:
                    book_dict['book_image'] = None

                books_list.append(book_dict)

        # Trả về danh sách sách dưới dạng JSON
        return JsonResponse({'books': books_list})

    # Nếu query trống, trả về danh sách rỗng
    return JsonResponse({'books': []})
@csrf_exempt
def sort_books(request):
    sortOption = request.GET.get('sortOption', '')

    if sortOption == 'name-asc':
        order_by = 'book_name ASC'
    elif sortOption == 'name-desc':
        order_by = 'book_name DESC'
    elif sortOption == 'quantity-asc':
        order_by = 'quantity ASC'
    elif sortOption == 'quantity-desc':
        order_by = 'quantity DESC'
    else:
        return JsonResponse({'books': []})

    # Truy vấn SQL để lấy sách và sắp xếp theo tiêu chí
    sql_query = f"""
    SELECT
        Books.id,
        Books.book_name,
        Books.auth,
        Books.quantity,
        Books.description,
        Books.tag,
        BookImages.book_image
    FROM
        Books
    JOIN
        BookImages ON Books.id = BookImages.bid
    ORDER BY
        {order_by};
    """

    with connections['default'].cursor() as cursor:
        cursor.execute(sql_query)
        
        books = cursor.fetchall()
        books_list = []
        for row in books:
            book_dict = {
                'id': row[0],
                'book_name': row[1],
                'auth': row[2],
                'quantity': row[3],
                'description': row[4],
                'tag': row[5],
            }

            binary_image = row[6]
            if binary_image:
                base64_image = base64.b64encode(binary_image).decode('utf-8')
                book_dict['book_image'] = base64_image
            else:
                book_dict['book_image'] = None

            books_list.append(book_dict)

    # Trả về danh sách sách đã sắp xếp dưới dạng JSON
    return JsonResponse({'books': books_list})
@csrf_exempt
def view_borrow_books(request):
    if request.method == 'GET':
        uid = request.GET.get('uid')


        # Kiểm tra uid có tồn tại không
        if not uid:
            print("UID not provided")
            return JsonResponse({'error': 'UID not provided'}, status=400)

        get_borrow_book_sql = """
            SELECT b.id, b.book_name, c.day_borrow, c.day_return, c.limit_day
            FROM Books b
            LEFT JOIN Cards c ON b.id = c.bid
            WHERE c.sid = %s
        """

        try:
            with connections['default'].cursor() as cursor:
                cursor.execute(get_borrow_book_sql, [uid])
                rows = cursor.fetchall() 

            # Kiểm tra hàng dữ liệu nhận được
            if not rows:
                print(f"Book borrow not found with UID: {uid}")
                return JsonResponse({'error': 'Book borrow not found'}, status=404)

            # Tạo danh sách các thông tin sách mượn
            borrow_book_info_list = []
            for row in rows:
                borrow_book_info = {
                    'id': row[0],
                    'book_name': row[1],
                    'day_borrow': row[2],
                    'day_return': row[3],
                    'limit_day': row[4],
                }
                borrow_book_info_list.append(borrow_book_info)


            # Trả về danh sách sách mượn dưới dạng JSON
            return JsonResponse(borrow_book_info_list, safe=False)

        except Exception as e:
            # Ghi nhật ký lỗi
            logger.error(f"Error fetching borrow book info: {e}")
            return JsonResponse({'error': 'Error fetching borrow book info'}, status=500)

    # Trả về lỗi nếu phương thức không phải là GET
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def save_book(request):
    if request.method == 'POST':
        id = request.POST.get('id')
        book_name = request.POST.get('book_name')
        quantity = request.POST.get('quantity')
        auth = request.POST.get('author')
        tag = request.POST.get('tag')
        description = request.POST.get('description')

        # Nếu có tệp tin ảnh bìa sách, lưu lại
        book_image = request.FILES.get('book_image')
        print('in',id,book_name,quantity,auth,tag,description,book_image)

        
        try:
            with connections['default'].cursor() as cursor:
                # Lưu sách vào cơ sở dữ liệu
                cursor.execute("""
                    INSERT INTO Books (id, book_name, quantity, auth, tag, description)
                    VALUES (%s, %s, %s, %s, %s, %s)
                """, (id, book_name, quantity, auth, tag, description))
                
                # Nếu có ảnh bìa sách, lưu ảnh vào thư mục chỉ định
                if book_image:
                    book_image_data = book_image.read()
                    insert_book_image_sql = """
                        INSERT INTO BookImages (bid, book_image)
                        VALUES (%s, %s)
                    """
                # if book_image:
                #     # Bạn có thể lưu book_image vào một thư mục trên máy chủ của mình, ví dụ:
                #     # với tên file `book_image.name` trong thư mục chỉ định
                #     file_path = f'media/book_images/{book_image.name}'
                #     with open(file_path, 'wb') as f:
                #         for chunk in book_image.chunks():
                #             f.write(chunk)
                    cursor.execute(insert_book_image_sql, (id, book_image_data))

                
                # Trả về phản hồi thành công
                return JsonResponse({"success": True, "message": "Book saved successfully."}, status=201)
                
        except Exception as e:
            # Trả về phản hồi lỗi
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        # Trả về phản hồi lỗi nếu phương thức không phải là POST
        return JsonResponse({"success": False, "message": "Method not allowed."}, status=405)
@csrf_exempt
def delete_books(request):
    print("xóa")
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            
            book_ids = data.get('ids', [])
            
            if not book_ids:
                return JsonResponse({"success": False, "message": "No book IDs provided."}, status=400)
            
            with connections['default'].cursor() as cursor:
                cursor.execute("DELETE FROM BookImages WHERE bid IN %s", [tuple(book_ids)])
                cursor.execute("DELETE FROM Books WHERE id IN %s", [tuple(book_ids)])
            
            return JsonResponse({"success": True, "message": "Books and related images deleted successfully."}, status=200)
        except Exception as e:
            return JsonResponse({"success": False, "message": str(e)}, status=500)
    else:
        return JsonResponse({"success": False, "message": "Method not allowed."}, status=405)
@csrf_exempt
def get_book_info(request):
    if request.method == 'GET':
        try:
            # Lấy bookId từ yêu cầu
            book_id = request.GET.get('bookId')
            print("In bookid ",book_id)

            # Kiểm tra bookId có tồn tại không
            if not book_id:
                return JsonResponse({'error': 'Book ID not provided'}, status=400)

            # Truy vấn SQL thô để lấy thông tin sách
            get_book_sql = """
                SELECT b.id, b.book_name, b.auth, b.quantity, b.tag, 
                    b.description, i.book_image
                FROM Books b
                LEFT JOIN BookImages i ON b.id = i.bid
                WHERE b.id = %s
            """

            with connections['default'].cursor() as cursor:

                # Thực hiện truy vấn SQL thô
                cursor.execute(get_book_sql, [book_id])
                row = cursor.fetchone()

                # Kiểm tra nếu không tìm thấy sách
                if not row:
                    logger.warning(f"Book not found with ID: {book_id}")
                    return JsonResponse({'error': 'Book not found'}, status=404)

                # Phân tách dữ liệu từ hàng dữ liệu
                book_id, book_name, author,quantity,tag, description, book_image = row

                # Nếu có dữ liệu ảnh, chuyển đổi nó sang Base64
                image_base64 = None
                if book_image:
                    image_base64 = base64.b64encode(book_image).decode('utf-8')

                # Tạo từ điển chứa thông tin sách
                book_info = {
                    'book_id': book_id,
                    'book_name': book_name,
                    'auth': author,
                    'quantity': quantity,
                    'tag': tag,
                    'description': description,
                    'book_image': image_base64,
                }

                # Trả về thông tin sách dưới dạng JSON
                return JsonResponse(book_info)

        except Exception as e:
            # Ghi nhật ký lỗi
            logger.error(f"Error fetching book info: {e}")
            return JsonResponse({'error': 'Error fetching book info'}, status=500)

    # Trả về lỗi nếu phương thức không phải là GET
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def edit_book(request):
    print('edit book nè')
    if request.method == 'POST':
        try:
            
            book_id = request.POST.get('book_id')
            book_name = request.POST.get('book_name')
            author = request.POST.get('auth')
            quantity = request.POST.get('quantity')
            tag = request.POST.get('tag')
            description =request.POST.get('description')
            book_image = request.FILES.get('book_image')
            
            # Kiểm tra xem book_id có tồn tại không
            if not book_id:
                return JsonResponse({'error': 'Book ID not provided'}, status=400)
            
            # Câu truy vấn SQL để cập nhật thông tin sách
            update_book_sql = """
                UPDATE Books
                SET book_name = %s, auth = %s, quantity = %s,
                  tag = %s, description = %s
                WHERE id = %s
            """
            
            # Ghi nhật ký câu truy vấn SQL và giá trị
            
            with connections['default'].cursor() as cursor:
                # Cập nhật thông tin sách trong bảng Books
                cursor.execute(update_book_sql, [
                    book_name, author, quantity, 
                    tag, description, book_id
                ])
                
                # Cập nhật ảnh sách nếu có
                if book_image:
                    book_image_data = book_image.read()                    
                    update_image_sql = """
                        UPDATE BookImages
                        SET book_image = %s
                        WHERE bid = %s
                    """
                   
                    
                    cursor.execute(update_image_sql, [book_image_data, book_id])
            
            # Trả về phản hồi thành công
            return JsonResponse({"success": True, "message": "Book edited successfully."}, status=200)
        
        except Exception as e:
            # Trả về phản hồi lỗi nếu có bất kỳ vấn đề nào
            return JsonResponse({'error': f'Error editing book: {e}'}, status=500)
    
    # Trả về lỗi nếu phương thức không phải là POST
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def search_books_dtb(request):
    if request.method == 'GET':
        search_query = request.GET.get('searchQuery', '')
        username = request.GET.get('username')
        print("searh username nè ",username)
        # Kiểm tra nếu không có searchQuery
        if not search_query:
            return JsonResponse({'error': 'searchQuery is required'}, status=400)

        # Truy vấn SQL để tìm sách có tên chứa searchQuery
        sql = """
        SELECT
            b.id,
            b.book_name,
            c.day_borrow,
            c.day_return,
            c.limit_day
        FROM
            Books AS b
        JOIN
            Cards AS c ON c.bid = b.id
        WHERE
            c.sid = %s
            AND b.book_name LIKE %s ;
        """

        try:
            # Thực thi truy vấn và lấy dữ liệu
            with connections['default'].cursor() as cursor:
                
                cursor.execute(sql, [username, f'%{search_query}%'])
                data = cursor.fetchall()

            # Chuyển đổi dữ liệu thành danh sách dictionary
            results = []
            for row in data:
                results.append({
                    'id': row[0],
                    'book_name': row[1],
                    'day_borrow': row[2],
                    'day_return': row[3],
                    'limit_day': row[4],
                })

            # Trả về kết quả dưới dạng JSON
            return JsonResponse(results, safe=False)

        except Exception as e:
            print(f"Error processing request: {e}")
            return JsonResponse({'error': 'Error processing request'}, status=500)

    return HttpResponseBadRequest("Method not allowed")
