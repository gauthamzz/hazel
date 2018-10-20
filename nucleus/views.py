# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.shortcuts import render

from django.contrib import messages
from django.http import HttpResponse,HttpResponseRedirect,Http404
from django.shortcuts import render,get_object_or_404,redirect
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import authenticate, login
from django.contrib.auth.models import User, Group
from django.db.models import Q
from difflib import SequenceMatcher
from django.views.decorators.csrf import csrf_exempt

import os


from .models import Repo, Code
from .forms import RepoForm, CodeForm

def repo_create(request):
    form = RepoForm(request.POST or None)
    if form.is_valid():
        instance = form.save(commit=False)
        instance.user=request.user.username
        instance.save()
        messages.success(request,"Repo registered successfully")
        return HttpResponseRedirect('/'+str(instance.id))
    context={
        "form":form,
    }
    return render(request,"repo_form.html",context)

def code_create(request,id=None):
    repo = get_object_or_404(Repo,id=id)
 
    form =SpaceForm(request.POST or None)
    if form.is_valid():
        instance = form.save(commit=False)
        instance.repo = repo
        instance.save()
        messages.success(request,"Code registered successfully")
        return HttpResponseRedirect("/"+str(code.id))
    context={
        "form":form,
        "galaxy": repo,
    }
    return render(request,"form.html",context)

def code_list(request,id=None):
    # if not request.user.is_authenticated:
    #     return HttpResponseRedirect("/accounts/login")
    repo = get_object_or_404(Repo,id=id)
    print("yay")

    code = Code.objects.filter(repo=repo)
    context={
        "repo":repo,
        "code":code,
    }
    return render(request,"list.html",context)

def submit_model(request):
    print(request.POST.get('connects'))
    # f = open("generated/a.py","a+")
    # f.write("")
    # f.close()
    run()
    return HttpResponse('')

def run():
    os.system('deepin-terminal -e python generated/a.py')

def test_model(request):
    print(request.POST.get('file'))
    file  = request.POST.get('file')
    os.system('deepin-terminal -e python generated/test.py data/' + file )
    return HttpResponse('')
