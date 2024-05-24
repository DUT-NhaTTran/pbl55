# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class Accounts(models.Model):
    username = models.OneToOneField('Users', models.DO_NOTHING, db_column='username', primary_key=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    role = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Accounts'


class Avatars(models.Model):
    avatar_id = models.AutoField(primary_key=True)
    uid = models.ForeignKey('Users', models.DO_NOTHING, db_column='uid', blank=True, null=True)
    # image = models.TextField()
    image = models.BinaryField(null=True, blank=True)  # Trường lưu dữ liệu ảnh dưới dạng binary blob


    class Meta:
        managed = False
        db_table = 'Avatars'


class Bookimages(models.Model):
    biid = models.AutoField(primary_key=True)
    bid = models.ForeignKey('Books', models.DO_NOTHING, db_column='bid', blank=True, null=True)
    book_image = models.BinaryField(null=True, blank=True)  # Trường lưu dữ liệu ảnh dưới dạng binary blob


    class Meta:
        managed = False
        db_table = 'BookImages'


class Books(models.Model):
    id = models.CharField(primary_key=True, max_length=255)
    book_name = models.CharField(max_length=255, blank=True, null=True)
    quantity = models.IntegerField(blank=True, null=True)
    auth = models.CharField(max_length=255, blank=True, null=True)
    tag = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    enter_book = models.DateTimeField(blank=True, null=True)


    class Meta:
        managed = False
        db_table = 'Books'


class Cards(models.Model):
    ca_id = models.AutoField(primary_key=True)
    sid = models.ForeignKey('Users', models.DO_NOTHING, db_column='sid', blank=True, null=True)
    bid = models.ForeignKey('Books', models.DO_NOTHING, db_column='bid', blank=True, null=True)
    day_borrow = models.DateTimeField(blank=True, null=True)
    day_return = models.DateTimeField(blank=True, null=True)
    limit_day = models.IntegerField(blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Cards'


class Checkin(models.Model):
    chid = models.AutoField(primary_key=True)
    time_in = models.DateTimeField(blank=True, null=True)
    time_out = models.DateTimeField(blank=True, null=True)
    uid = models.ForeignKey('Users', models.DO_NOTHING, db_column='uid')

    class Meta:
        managed = False
        db_table = 'CheckIn'


class Classes(models.Model):
    cid = models.CharField(primary_key=True, max_length=255)
    fid = models.ForeignKey('Faculties', models.DO_NOTHING, db_column='fid', blank=True, null=True)
    class_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Classes'


class Faculties(models.Model):
    fid = models.IntegerField(primary_key=True)
    faculty_name = models.CharField(max_length=255, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'Faculties'


class Users(models.Model):
    uid = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    id = models.CharField(max_length=255, blank=True, null=True)
    gender = models.IntegerField(blank=True, null=True)
    birth = models.DateField(blank=True, null=True)
    cid = models.ForeignKey(Classes, models.DO_NOTHING, db_column='cid', blank=True, null=True)
    isadmin = models.IntegerField(db_column='isAdmin', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'Users'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=150)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=255)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class AuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField(blank=True, null=True)
    is_superuser = models.IntegerField()
    username = models.CharField(unique=True, max_length=150)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.CharField(max_length=254)
    is_staff = models.IntegerField()
    is_active = models.IntegerField()
    date_joined = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'auth_user'


class AuthUserGroups(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_groups'
        unique_together = (('user', 'group'),)


class AuthUserUserPermissions(models.Model):
    id = models.BigAutoField(primary_key=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.PositiveSmallIntegerField()
    change_message = models.TextField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    user = models.ForeignKey(AuthUser, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoMigrations(models.Model):
    id = models.BigAutoField(primary_key=True)
    app = models.CharField(max_length=255)
    name = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_migrations'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class Pbl5Accounts(models.Model):
    id = models.BigAutoField(primary_key=True)
    password = models.CharField(max_length=255, blank=True, null=True)
    role = models.IntegerField(blank=True, null=True)
    username = models.OneToOneField('Pbl5Users', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'pbl5_accounts'


class Pbl5Users(models.Model):
    uid = models.CharField(primary_key=True, max_length=255)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=255, blank=True, null=True)
    id = models.CharField(max_length=255, blank=True, null=True)
    gender = models.IntegerField(blank=True, null=True)
    birth = models.DateField(blank=True, null=True)
    isadmin = models.IntegerField(db_column='isAdmin')  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'pbl5_users'
