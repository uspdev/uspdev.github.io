console.log('Js working');

$(document).ready(function(){
    var toc = document.getElementById('toc');
    toc.innerHTML = '';
  
    $('.main-content h2, .main-content h3').each(function() {
  
      // <a href="{{ page.link }}" rel="permalink"><i class="fa fa-link" aria-hidden="true" title="permalink"></i><span class="sr-only">Permalink</span></a>
      var id;
      var item;
  
      id = $(this).attr('id');
      item = `<li><a href="#${id}">` + $(this).text() + '</a></li>';
  
      if ($(this).prop("tagName") === 'H2') {
        toc.innerHTML += item;
      } else {
        toc.innerHTML += `<ul>${item}</ul>`;
      }
  
      $(this).wrap(function() {
        return `<a href='#${id}'></a>`;
      });
  
      $(this).append(` <a href="#${id}"></a>`);
    });
  
    toc.innerHTML += '';
  
  
  });