# -*- coding: utf-8 -*-
from __future__ import unicode_literals

from django.db import models
from django.urls import reverse
# Create your models here.

class Repo(models.Model):
    title = models.CharField(max_length=60)
    description = models.TextField()
    saved_model = models.TextField(default="")
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    stars = models.IntegerField(default=0)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)
    user=models.CharField(max_length=120,default="Annonymous")

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title

    def get_absolute_url(self):
        return reverse("stars:create", kwargs={"id":self.id})


class Code(models.Model):
    title = models.CharField(max_length=60)
    code = models.TextField()
    repo = models.ForeignKey(Repo, on_delete=models.CASCADE,blank=True, null=True)
    private = models.BooleanField(default = True)
    last_modified = models.DateTimeField(auto_now_add=False, auto_now=True)
    created = models.DateTimeField(auto_now_add=True, auto_now=False)

    def __unicode__(self):
        return self.title

    def __str__(self):
        return self.title
