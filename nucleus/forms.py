from django import forms
from .models import Repo,Code


class RepoForm(forms.ModelForm):
    class Meta:
        model =  Repo
        fields = [
            "title",
            "description"
        ]

class CodeForm(forms.ModelForm):
    class Meta:
        model = Code
        fields = [
            "title",
            "code",
            "repo"
        ]