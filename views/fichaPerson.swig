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
             <div class="main ficha">
                         <div><img src="{{person.image}}" /></div>
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
          <a id="ordenNombre" target="_blank" href="https://docs.google.com/forms/d/1NoOYENvhHXqpLO3WpB8l6R8ofJkJiShLlx2A_DfrNd0/viewform?embedded=true&hl=es" >
            <i class="fa fa-exclamation-triangle"></i>
            Reportar Errores</a>
        
                    <table class="table table-condensed">
                        <tbody>
                            <tr>
                                <th>Cargo</th>
                                <th>Organizaci&oacute;n</th>
                                <th>Comienzo</th>
                                <th>Fin</th>
                                <th>Class</th>
                                <th>Type</th>
                                <th>Intended Duration</th>
                                <th>Sources</th>
                            </tr>

        {% for m in person.memberships %}

                            <tr ng-repeat="m in row.memberships">
                                <td>{{m.role}}</td>
                                <td><a target="_blank" class="organization" data-organization-id="" href="/{{instanceName}}/organization/{{m.organization_id}}">{{m.organization_id}}</a></td>
                                <td>{{m.start_date}}</td>
                                <td>{{m.end_date}}</td>
                                <td>{{m.class}}</td>
                                <td>{{m.type}}</td>
                                <td>{{m.intended_duration}}</td>
                                <td>
                                  {% for source in m.sources %}
                                    <div>{{source.quality}}</div>
                                    <div>{{source.source_url}}</div>
                                    <div>{{source.source}}</div>
                                    <div>{{source.data}}</div>
                                  {% endfor %}
                                </td>
                            </tr>
        {% endfor %}

                        </tbody>
                    </table>


    </div>
        </div>
    </div>

{% endblock %}

