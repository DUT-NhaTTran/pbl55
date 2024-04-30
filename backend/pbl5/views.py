from django.http import HttpResponseBadRequest, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connections
import json

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
                users.avatar,
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
                    'avatar': row[2],
                    'email': row[3],
                    'id': row[4],
                    'gender': row[5],
                    'birth': row[6],
                    'class_name': row[7],
                    'time_in': row[8],
                    'time_out': row[9],
                })

            # Trả về phản hồi JSON chứa dữ liệu
            return JsonResponse(results, safe=False)

        except Exception as e:
            # Bắt và xử lý lỗi trong quá trình thực hiện truy vấn
            print("Error executing query:", e)
            # Trả về mã trạng thái HTTP 500 với thông báo lỗi
            return JsonResponse({'error': 'Error executing query'}, status=500)
    
    # Trả về mã trạng thái HTTP 405 nếu phương thức yêu cầu không phải là GET
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
            users.avatar,
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
                    'avatar': row[2],
                    'email': row[3],
                    'id': row[4],
                    'gender': row[5],
                    'birth': row[6],
                    'class_name': row[7],
                    'time_in': row[8],
                    'time_out': row[9],
                })

            # Return the list of dictionaries as a JSON response
            return JsonResponse(results, safe=False)

        except Exception as e:
            print(f"Error processing request: {e}")
            return JsonResponse({'error': 'Error processing request'}, status=500)

    # Return an error response if the request method is not GET
    return HttpResponseBadRequest("Method not allowed")

@csrf_exempt
def user_delete_view(request):
    if request.method == 'DELETE':
        try:
            # Lấy dữ liệu JSON từ yêu cầu
            data = json.loads(request.body)
            uids = data.get('uids')

            # Kiểm tra nếu `uids` không tồn tại hoặc không hợp lệ
            if not uids or not isinstance(uids, list):
                return JsonResponse({'error': 'No uids provided or uids is not a list'}, status=400)

            # Thực hiện truy vấn trong khối `with`
            with connections['default'].cursor() as cursor:
                for uid in uids:
                    cursor.execute("DELETE FROM CheckIn WHERE uid = %s", [uid])
                    cursor.execute("DELETE FROM Users WHERE uid = %s", [uid])
                    cursor.execute("DELETE FROM Accounts WHERE username = %s", [str(uid)])
                    cursor.execute("DELETE FROM Cards WHERE sid = %s", [uid])

            return JsonResponse({'message': 'Records deleted successfully'}, status=200)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)

        except Exception as e:
            # Ghi nhật ký và in lỗi nếu có
            print(f"Error processing request: {e}")
            return JsonResponse({'error': 'An error occurred while processing the request'}, status=500)

    # Trả về mã trạng thái HTTP 405 nếu phương thức yêu cầu không phải là DELETE
    return HttpResponseBadRequest("Method not allowed")
