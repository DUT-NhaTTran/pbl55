"""music_controller URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.1/topics/http/urls/
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
from django.urls import path, include
from pbl5.views import *
from pbl5 import views
urlpatterns = [
    path('admin/', admin.site.urls),
    path('account', AccountView.as_view(),name="account"),
    path('account_change',AccountChangeView.as_view(),name='account_change'),
    path('user', UserListView.as_view(), name='user'),
    path('user_manage', UserManageView.as_view(), name='user_manage'),
    path('user_checking', UserCheckingView.as_view(), name='user_checking'),
    path('user/search', UserSearchView.as_view(), name='user/search'),
    path('user/delete', UserDeleteView.as_view(), name='user/delete'),
    path('get_fids',GetFidView.as_view(), name='get_fids'),
    path('get_classes/', GetClassesView.as_view(), name='get_classes'),
    path('save_user', SaveUserView.as_view(), name='save_user'),
    path('save_checkin', SaveCheckin.as_view(), name='save_checkin'),
    path('save_account', SaveAccountView.as_view(), name='save_account'), 
    path('get_avatar_url', GetAvatarURLView.as_view(), name='get_avatar_url'),
    path('get_tags',GetCategoriesView.as_view(),name='get_tags'),
    path('get_books_info', GetBooksInfo.as_view(), name='get_books_info'), 
    path('books_by_tag', BooksByTag.as_view(), name='books_by_tag'),
    path('get_user_info', GetUserInfo.as_view(), name='get_user_info'),
    path('edit_user_view', EditUserView.as_view(), name='edit_user_view'),
    path('search_books', SearchBooks.as_view(), name='search_books'),
    path('sort_books', SortBooks.as_view(), name='sort_books'),
    path('view_borrow_books', ViewBorrowBooks.as_view(), name='view_borrow_books'),
    path('save_book', SaveBookView.as_view(), name='save_book'),
    path('edit_book', views.EditBook.as_view(), name='edit_book'),
    path('delete_books', DeleteBooks.as_view(), name='delete_books'),
    path('get_book_info', GetBookInfo.as_view(), name='get_book_info'),
    path('search_books_dtb/', SearchBooksDTB.as_view(), name='search_books_dtb'),
    path('get_checkin_count', GetCheckinCount.as_view(), name='get_checkin_count'),
    path('get_books_count', GetBooksCount.as_view(), name='get_books_count'),
    path('get_borrow_book_count', GetBorrowBookCount.as_view(), name='get_borrow_book_count'),
    path('get_tags_and_counts',GetCategoriesAndCounts.as_view(), name='get_tags_and_counts'),
    path('user_checking_data', UserCheckingData.as_view(), name='user_checking_data'),
]