from rest_framework import serializers
from .models import Accounts

class AccountSerializer(serializers.Serializer):
    usernameTxt = serializers.CharField()
    passwordTxt = serializers.CharField()

    def validate(self, data):
        username_value = data.get('usernameTxt')
        password_value = data.get('passwordTxt')

        if not username_value or not password_value:
            raise serializers.ValidationError("Both usernameTxt and passwordTxt are required fields.")

        
        return {
            'username': username_value,
            'password': password_value
        }
