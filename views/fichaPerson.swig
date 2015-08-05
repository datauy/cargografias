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
            Fichas
        </div>
             <div class="main" >
                  <h1>{{person.name}}</h1>
                    <div><img src="{{person.image}}" /></div>
                    <table class="table table-condensed">
                        <tbody>
                            <tr>
                                <th>Start</th>
                                <th>End</th>
                                <th>Role</th>
                                <th>Label</th>
                                <th>Organization</th>
                            </tr>

        {% for m in person.memberships %}

                            <tr ng-repeat="m in row.memberships">
                                <td>{{m.start_date}}</td>
                                <td>{{m.end_date}}</td>
                                <td>{{m.role}}</td>
                                <td>{{m.label}}</td>
                                <td>
                                    <a target="_blank" href="/{{instanceName}}/organization/{{m.organization_id}}">{{m.organization_id}}</a></td>
                            </tr>
        {% endfor %}

                        </tbody>
                    </table>


    </div>
        </div>
    </div>

{% endblock %}

