<!DOCTYPE html>
<html>
<head>
    
   <title>Cargografías Ficha</title>

    <meta name="viewport" content="initial-scale=1, maximum-scale=1, user-scalable=no" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta http-equiv="Content-Type" content="text/html; charset=iso-8859-1" />
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <link href="/favicon.ico" type="image/x-icon" rel="icon" />
    <link href="/favicon.ico" type="image/x-icon" rel="shortcut icon" />

<link href='//fonts.googleapis.com/css?family=Lato:400,700,400italic' rel='stylesheet' type='text/css'>
    
    <!-- V3 Styles -->

    <link href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.3.0/css/font-awesome.css" rel="stylesheet">
    <link rel="stylesheet" href="/css/new-timeline.css" type="text/css">
    <!-- V4 Styles -->
    <link rel="stylesheet" href="/css/flexboxgrid.min.css" type="text/css">
    
    <link rel="stylesheet" href="/css/cargo-base.css" type="text/css">
    <link rel="stylesheet" href="/css/animations.css" type="text/css">
    <link rel="stylesheet" href="/bower_components/wow.js/css/libs/animate.css" type="text/css">
    
    <!-- V2 Libs -->
    <script type="text/javascript" src="/js/lib/jquery-2.0.0.min.js"></script>
    <script type="text/javascript" src="/js/lib/underscore.min.js"></script>
    <script type="text/javascript" src="/js/lib/d3.min.js"></script>


    

    <script type="text/javascript">
        var _gaq = _gaq || [];
        _gaq.push(['_setAccount', 'UA-18158765-5']);
        _gaq.push(['_trackPageview']);

        (function() {
            var ga = document.createElement('script');
            ga.type = 'text/javascript';
            ga.async = true;
            ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ga, s);
        })();
    </script>

 

</head>

<body class="angled stripes">

    <div class="navbar navbar-fixed-top">
        <div class="navbar-inner">
            <div class="container">
                <a class="brand"><h3>Cargografias - Ficha</h3></a>
                <div class="nav-collapse collapse">
                    <ul class="nav">
                       

                    </ul>
                    <ul class="nav pull-right">
                    </ul>
                </div>
                <!--/.nav-collapse -->
            </div>
        </div>
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

    <footer class="well">
    </footer>

    
</body>
</html>
