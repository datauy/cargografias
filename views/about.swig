{% extends 'layout.html' %}

{% block title %}
Cargografías Acerca De
{% endblock %}

{% block head %}
  {% parent %}
 
{% endblock %}

{% block content %}

    <div class="main">
        <div ng-view="" id="cargoContainer" class="ng-scope"><div class="module ng-scope">

        <div class="description">
            Acerca de Cargografias
        </div>
            <div class="content">
                <h1>Hola! </h1>
            </div>
        </div>
    </div>

{% endblock %}
