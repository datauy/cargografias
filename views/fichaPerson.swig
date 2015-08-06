{% extends 'layout.html' %}

{% block title %}
    {{person.name}} - Ficha @ Cargografías.org
{% endblock %}

{% block head %}
  {% parent %}
 
{% endblock %}

{% block content %}

    <div class="main">
        <div ng-view="" id="cargoContainer" class="ng-scope">
            <div class="module ng-scope">

        <div class="description">
            Fichas Personales
        </div>


             <div class="main ficha"
>                  <div><img src="{{person.image}}" /></div>
                  <div>
                      <h1>{{person.name}}</h1>
                      <p><b>Bio:<b>{{m.bio}}
                          <b>Nacimiento:<b>{{m.birth}}
                          <b>Muerte:<b>{{m.death}}
                          <br>
                          <b>Contacto:<b>mail: aslalalal@asasas.com | @tawwewewew | www.{{person.name}}.com
                      </p>
                  </div>
                  <div style="clear: both;"></div>
                    <table class="table table-condensed">
                        <tbody>
                            <tr>
                                <th>Cargo</th>
                                <th>Organizaci&oacute;n</th>
                                <th>Comienzo</th>
                                <th>Fin</th>
                            </tr>

        {% for m in person.memberships %}

                            <tr ng-repeat="m in row.memberships">
                                <td>{{m.role}}</td>
                                <td><a target="_blank" href="/{{instanceName}}/organization/{{m.organization_id}}">{{m.organization_id}}</a></td>
                                <td>{{m.start_date}}</td>
                                <td>{{m.end_date}}</td>
                            </tr>
        {% endfor %}

                        </tbody>
                    </table>


    </div>
        </div>
    </div>

{% endblock %}

