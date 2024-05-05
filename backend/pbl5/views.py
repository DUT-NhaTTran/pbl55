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
            avatar_file = request.FILES.get('avatar')

            logger.debug(f"Received data: uid={uid}, name={name}, email={email}, id={user_id}, birthDate={birth_date}, gender={gender}, cid={cid}")

            # Chuyển đổi giá trị giới tính thành số
            if gender == 'male' or gender == '1':
                gender = 1
            elif gender == 'female' or gender == '0':
                gender = 0
            else:
                logger.warning(f"Invalid gender value: {gender}")
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
                # Thực hiện truy vấn để lưu người dùng
                cursor.execute(insert_user_sql, (uid, name, email, user_id, birth_date, gender, cid, 0))

                # Nếu có avatar, lưu vào bảng Avatars
                if avatar_file:
                    avatar_data = avatar_file.read()
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
                SELECT u.uid, u.name, u.email, u.id, u.birth, u.gender, u.cid, u.isAdmin, c.class_name, a.image
                FROM Users u
                LEFT JOIN Avatars a ON u.uid = a.uid
                LEFT JOIN Classes c ON u.cid = c.cid
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
                uid, name, email, user_id, birth_date, gender, cid, is_admin,class_name, avatar_data= row

               
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
                    'cid': cid,
                    'is_admin': is_admin,
                    'avatar': avatar_base64,
                    'class_name':class_name
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
            name = request.POST.get('name')
            email = request.POST.get('email')
            user_id = request.POST.get('id')
            birth_date = request.POST.get('birthDate')
            gender = request.POST.get('gender')
            cid = request.POST.get('cid')
            avatar_file = request.FILES.get('avatar')

            logger.debug(f"Received data: uid={uid}, name={name}, email={email}, id={user_id}, birthDate={birth_date}, gender={gender}, cid={cid}")

            # Chuyển đổi giá trị giới tính thành số
            if gender == 'male' or gender == '1':
                gender = 1
            elif gender == 'female' or gender == '0':
                gender = 0
            else:
                logger.warning(f"Invalid gender value: {gender}")
                return JsonResponse({'error': 'Invalid gender value'}, status=400)

            # Câu truy vấn SQL để cập nhật thông tin người dùng
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
            update_avatar_sql = """
                REPLACE INTO Avatars (uid, image)
                VALUES (%s, %s)
            """

            with connections['default'].cursor() as cursor:
                # Thực hiện truy vấn để cập nhật người dùng
                cursor.execute(update_user_sql, (name, email, user_id, birth_date, gender, cid, uid))

                # Nếu có avatar, cập nhật bảng Avatars
                if avatar_file:
                    avatar_data = avatar_file.read()
                    cursor.execute(update_avatar_sql, (uid, avatar_data))

            return JsonResponse({'message': 'User and avatar updated successfully'})

        except Exception as e:
            # Ghi nhật ký lỗi
            logger.error(f"Error updating user data: {e}")
            return JsonResponse({'error': 'Error updating user data'}, status=500)

    # Trả về lỗi nếu phương thức không phải là POST
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
