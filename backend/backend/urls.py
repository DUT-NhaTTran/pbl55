"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from . import views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('account', views.account_view, name='account'),
    path('account_change',views.account_change_view,name='account_change'),
    path('user', views.user_list_view, name='user'),
    path('user/search', views.user_search_view, name='user/search'),
    path('user/delete', views.user_delete_view, name='user/delete'),
    path('get_fids', views.get_fid_view, name='get_fids'),
    path('get_classes/', views.get_classes_view, name='get_classes'),
    path('save_user', views.save_user_view, name='save_user'),
    path('save_account', views.save_account_view, name='save_account'),
    path('get_avatar_url', views.get_avatar_url_view, name='get_avatar_url'),
    path('get_tags',views.get_catagories_view,name='get_tags'),
    path('get_books_info', views.get_books_info, name='get_books_info'), 
    path('books_by_tag', views.books_by_tag, name='books_by_tag'),
    path('get_user_info', views.get_user_info, name='get_user_info'),
    path('edit_user_view', views.edit_user_view, name='edit_user_view'),
    path('search_books', views.search_books, name='search_books'),
    path('sort_books', views.sort_books, name='sort_books'),
    path('view_borrow_books', views.view_borrow_books, name='view_borrow_books'),
    path('save_book', views.save_book, name='save_book'),
    path('delete_books', views.delete_books, name='delete_books'),
    path('get_book_info', views.get_book_info, name='get_book_info'),
    path('edit_book', views.edit_book, name='edit_book'),
    path('search_books_dtb/', views.search_books_dtb, name='search_books_dtb'),










]
