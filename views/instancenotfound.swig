{% extends 'layout.html' %}

{% block title %}
Cargografias - Not Found 
{% endblock %}

{% block head %}
  {% parent %}
 
{% endblock %}

{% block content %}

    <div class="main">
        <div ng-view="" id="cargoContainer" class="ng-scope"><div class="module ng-scope">

        <div class="description">
            Oops..
        </div>
            <div class="content">
                <h1>This instance was not found. :-( <br />
                How about to create it? We can help you! <br/>
                Write us at:<strong>
                equipo@cargografias.org</strong></h1>
            </div>
        </div>
    </div>

{% endblock %}





