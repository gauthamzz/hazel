# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.contrib import admin

from .models import Repo, Code

# Register your models here.

@admin.register(Repo)
class RepoAdmin(admin.ModelAdmin):
    list_display = ("title", "description")
    list_filter = ("title", "description")
    search_fields = ("title", "description")

@admin.register(Code)
class CodeAdmin(admin.ModelAdmin):
    list_display = ("title", "code")
    list_filter = ("title", "code")
    search_fields = ("title","code")
