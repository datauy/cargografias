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
                  <div class="items-personales"><img src="{{person.image}}" /></div>
                  <div class="items-personales">
                      <h1>{{person.name}}</h1>
                      <p><b>Bio:</b>Nació en Buenos Aires el 13 de enero de 1957. Estudió Marketing en la U.A.D.E., de Buenos Aires. En 1991 se casó con Karina Rabolini. Fue deportista profesional. En su paso por la Motonáutica, sufrió un accidente por el que le amputaron un brazo. Fue diputado nacional, y Secretario de deportes y turismo de la Nación durante el gobierno de Carlos Menem. Fue electo Vicepresidente de la Nación en 2003 en la fórmula que encbezaba Néstor Kirchner. Es el actual Gobernador de la Provincia de Buenos Aires, cargo para el que fue reelecto en 2011. Su primer mandato como Gobernador se inició en 2007.{{m.bio}}
                          <b>Nacimiento:</b>{{m.birth}}
                          <b>Muerte:</b>{{person.death}}
                          <br>
                          <b>Contacto:</b>{{person.contact_details}}
                      </p>
                    <a id="ordenNombre" target="_blank" href="https://docs.google.com/forms/d/1NoOYENvhHXqpLO3WpB8l6R8ofJkJiShLlx2A_DfrNd0/viewform?embedded=true&hl=es" >
                        <i class="fa fa-exclamation-triangle"></i>Reportar Errores</a>
               
                  </div>
                  <div style="clear: both;"></div>
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
                                <th>Territorio</th>
                                <th>Sources</th>
                            </tr>

        {% for m in person.memberships %}

                            <tr ng-repeat="m in row.memberships">
                                <td>{{m.role}}</td>
                                <td><a target="_blank" class="organization load-organization" data-organization-id="{{m.organization_id}}" data-instance-name="{{instanceName}}" href="/{{instanceName}}/organization/{{m.organization_id}}">{{m.organization_id}}</a></td>
                                <td class="format-fecha">{{m.start_date}}</td>
                                <td class="format-fecha">{{m.end_date}}</td>
                                <td>{{m.class}}</td>
                                <td>{{m.type}}</td>
                                <td>{{m.intended_duration}}</td>
                                <td>{{m.area.name}}</td>
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

<script>
  $('.load-organization').each(function(ix, el){
    var instanceName = $(el).attr('data-instance-name')
    var organizationId = $(el).attr('data-organization-id')
    var url = "https://" + instanceName + ".popit.mysociety.org/api/v0.1/organizations/" + organizationId
    $(el).html('Loading...')
    $.getJSON(url, function(data){
      $(el).html(data.result.name)
    })
  })

  var parts3 = /^\d\d\d\d-\d\d-\d\d$/
  var parts2 = /^\d\d\d\d-\d\d$/
  $('.format-fecha').each(function(ix, el){
    var content = $(el).html();
    if(parts3.test(content)){
      $(el).html( moment(content, "YYYY-MM-DD").format('DD MMM YYYY') ) 
    }else if(parts2.test(content)){
      $(el).html( moment(content, "YYYY-MM").format('MMM YYYY') ) 
    }
  })
</script>

{% endblock %}

