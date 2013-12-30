<!DOCTYPE html>

<html>
  <head>
    <meta charset="utf-8">
    <title>Fermi Demo</title>
    
    <style>
      button {
         margin: 20px;
         height: 40px;
         width: 70px;
      }
      
      #chart-div {
         margin-top: 20px;
         width: 600px;
         height: 600px;
      }
      
   </style>

   <script type="text/javascript" src="/js/jquery-2.0.2.min.js"></script>

    <script type="text/javascript" src="https://www.google.com/jsapi"></script>
    <script type="text/javascript">
    
      google.load("visualization", "1", {packages:["corechart"]});

      function drawChart(data) {
         console.log("new");
        var options = {
          title: 'Company Performance',
          hAxis: {title: 'Distance', titleTextStyle: {color: 'slategray'}}
        };

        var chart = new google.visualization.ColumnChart(document.getElementById('chart-div')); 
        chart.draw(data, options)
      }
      
      var count = 0;
            
      window.onload = function() {
         setInterval( 
            function () {
               count += 10;
               var data = google.visualization.arrayToDataTable([
                  ['Distance', 'Frequency'],
                  ['1',  1000],
                  ['2',  1170],
                  ['3',  660 + count],
                  ['4',  1030]
               ]);
          drawChart(data);
          },
           500
         );
      
      };
      
    </script>
    
  </head>
  <body>
      <h2>FERMI Demo</h2>
      <button onclick="$.get('/?start');" >START</button>
      <div id="chart-div">
      </div>
  </body>
</html>

