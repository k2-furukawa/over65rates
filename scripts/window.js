// div id: 'jqxwindow'

// create window
function createWindow( title ) {
  $('#jqxwindow').jqxWindow({
    showCollapseButton: true, 
    maxHeight: 500, maxWidth: 800, 
    minHeight: 500, minWidth: 800, 
    height:    500, width:    800,
//    theme: 'orange',
    initContent: function () {
      $('#jqxwindow').jqxWindow('focus');
    }
  });
  document.getElementById("window_header_text").innerHTML=title;
  $('#jqxwindow').jqxWindow('open');
};
