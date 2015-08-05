{% extends 'layout.html' %}

{% block title %}
 {{organization.name}}- Ficha @ Cargografías.org
{% endblock %}

{% block head %}
  {% parent %}
 
{% endblock %}

{% block content %}

    <div class="main">
        <div ng-view="" id="cargoContainer" class="ng-scope"><div class="module ng-scope">

        <div class="description">
            Ficha de 
        </div>
            <div class="content">
                <h1>{{organization.name}}</h1>
            </div>
        </div>
    </div>

{% endblock %}

