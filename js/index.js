var about_counter = 0;
var contact_counter = 0;

function show_about()
{	
	if(about_counter % 2 === 0)
		document.getElementById('about').style.display = "block";
	else
		document.getElementById('about').style.display = "none";
	about_counter += 1;
	
	if(document.getElementById('contact').style.display == "block")
		show_contact();
}

function show_contact()
{	
	if(contact_counter % 2 === 0)
		document.getElementById('contact').style.display = "block";
	else
		document.getElementById('contact').style.display = "none";
	
	contact_counter += 1;
	
	if(document.getElementById('about').style.display == "block")
		show_about();
}