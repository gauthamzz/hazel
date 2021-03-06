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

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from .serializers import imageSerializer

import os
from ast import literal_eval

from .test_api import api_call

from .models import Repo, Code, Image
from .forms import RepoForm, CodeForm
from .generate import generate,order

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
    model = ""
    if repo.saved_model:
        model = literal_eval(repo.saved_model)
    # print(model[0][0])
    context={
        "repo":repo,
        "model": model,
    }
    return render(request,"list.html",context)

def submit_model(request):
    connects =literal_eval(request.POST.get('connects'))
    print(connects)
    # try:
    generate(connects)
    print("File generated at generated/file.py")
    # except:
    #     print("Ooops some error in Generating model")
    # run()
    return HttpResponse('')

def train_model(request):
    os.system('deepin-terminal -e python generated/file.py')

def test_model(request):
    print(request.POST.get('file'))
    file  = request.POST.get('file')
    os.system('deepin-terminal -e python generated/test.py data/' + file )
    return HttpResponse('')

def save_model(request):
    connects =literal_eval(request.POST.get('connects'))
    id =request.POST.get('id')
    id = int(id[22:])
    print(id)
    
    print("Saving Model")
    print(connects)
    ordered = order(connects)
    print("After ordering the model is")
    print(ordered)
    print("---------------")
    print("---------------")
    repo = get_object_or_404(Repo, id= id)
    print(repo)
    print(repo.saved_model)
    print(repo.description)
    repo.saved_model = ordered
    repo.save()

    return HttpResponse('')

def repo_list(request):
    queryset_list=Repo.objects.all().order_by("-stars")
    context={
	"code":queryset_list,
	}
    return render(request,"repolist.html",context)



class imageList(generics.CreateAPIView) :
    queryset = Image.objects.all()
    serializer_class = imageSerializer
    
    def post(self, request, format=None):
        print(request.data)
        serializer = imageSerializer(data=request.data)
        if serializer.is_valid():
            # serialized_data = serializer.data
            name =str(serializer.validated_data['image'])
            serializer.validated_data['result'] = api_call('static/css/'+name)
            
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def get(self, request, format=None):
    #     image = request.POST.get('')
    #     image1 = Image.objects.all()
    #     serializer = imageSerializer(data=request.data)
    #     return Response(serializer.data)
    
    # def post(self):
    #     pass
