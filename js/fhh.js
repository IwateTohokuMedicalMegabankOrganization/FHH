var personal_information = null;
var current_health_history = [];
var current_relationship = "Self";

var diseases = {
		'Clotting Disorder': ['Deep Vein Thrombosis (DVT)', 'Pulmonary Embolism', 'Clotting Disorder', 'Unknown Clotting Disorder'],
		'Cancer': 			 ['Bone Cancer', 'Breast Cancer', 'Colon Cancer', 'Esophageal Cancer', 'Gastric Cancer', 'Kidney Cancer',
				   			  'Leukemia', 'Lung Cancer', 'Muscle Cancer', 'Ovarian Cancer', 'Prostate Cancer', 'Skin Cancer', 'Thyroid Cancer',
				   			  'Uterine Cancer', 'Hereditary onpolyposis colon cancer', 'Pancreatic cancer', 'Liver cancer', 'Brain Cancer',
				   		 	  'Colorectal Cancer', 'Other Cancer', 'Unknown Cancer'],
		'Diabetes': 		 ['Type 1 Diabetes', 'Type 2 Diabetes', 'Gestational Diabetes', 'Diabetes Mellitus', 'Unknown Diabetes'],
		'Gastrointestinal Disorder': ['Familial adenomatous polyposis', 'Colon Polyp', 'Crohn\'s Disease', 'Irritable Bowel Syndrome',
									  'Ulcerative Colitis', 'Gastrointestinal Disorder', 'Unknown Gastrointestinal Disorder'],
		'Heart Disease': 			 ['Heart Disease', 'Heart Attack', 'Coronary Artery Disease', 'Angina', 'Unknown Heart Disease'],					  
		'High Cholesterol' : [],
		'Hypertension': [],
		'Kidney Disease': ['Cystic Kidney Disease', 'Diabetic Kidney Disease', 'Nephritis', 'Kidney Nephrosis', 'Nephrotic Syndrome',
						   'Unknown Kidney Disease', 'Kidney Disease Present from Birth', 'Other Kidney Disease'],
		'Lung Disease': ['Asthma', 'Chronic Bronchitis', 'Chronic Lower Respiratory Disease', 'COPD', 'Emphysema', 'Influenza/Pneumonia',
					     'Unknown Lung Disease'],
		'Dementia/Alzheimer\'s': [],
		'Osteoporosis': [],
		'Mental Disorder': ['Anxiety', 'Attention Deficit Disorder-Hyperactivity', 'Autism', 'Bipolar Disorder', 'Dementia',  'Depression',
						    'Eating Disorder', 'Obsessive Compulsive Disorder', 'Panic Disorder', 'Personality Disorder', 
						    'Post Traumatic Stress Disorder', 'Schizophrenia', 'Social Phobia', 'Unspecified', 'Unknown Psychological Disorder'],
		'Septicemia': [],
		'Stroke/Brain Attack': [],
		'Sudden Infant Death Syndrome': [],
		'Other Disease': [],
		'Unknown Disease': []
	};

var disease_list = new Array();

// Used for showing the labels
var relationship_to_label = {
		'father':'Father',									'mother':'Mother',
		'paternal_grandfather':'Paternal Grandfather',		'maternal_grandfather':'Maternal Grandfather',
		'paternal_grandmother':'Paternal Grandmother',		'maternal_grandmother':'Maternal Grandmother',

		'brother':'Brother',								'sister':'Sister',
		'son':'Son',										'daughter':'Daughter',
		'grandson':'Grandson',								'granddaughter':'Granddaughter',
		'nephew':'Nephew',									'niece':'Niece',
		
		'paternal_aunt':'Paternal Aunt',					'maternal_aunt':'Maternal Aunt',
		'paternal_uncle':'Paternal Uncle',					'maternal_uncle':'Maternal Uncle',
		'paternal_cousin':'Paternal Cousin',				'maternal_cousin':'Maternal Cousin',
		'paternal_halfbrother':'Paternal Half Brother',		'maternal_halfbrother':'Maternal Half Brother',
		'paternal_halfsister':'Paternal Half Sister',		'maternal_halfsister':'Maternal Half Sister'
};

$(document).ready(function() {
	make_disease_array(); // From load_xml

	// personal_information_dialog
	$("#add_personal_information_dialog").load ("add_personal_information_dialog.html", function () {
		build_personal_health_information_section();
		build_personal_race_ethnicity_section();
		bind_personal_submit_button_action();
		bind_personal_cancel_button_action();
	});

	$("#add_personal_information_dialog").dialog({
		title:"Enter Personal Information",
		position:['middle',0],
		autoOpen: false,
		height:600,
		width:1000,
	});		
	
	// family_member_information_dialog
	$("#update_family_member_health_history_dialog").load ("update_family_member_health_history_dialog.html", function () {
		build_family_health_information_section();
		build_family_race_ethnicity_section();
		bind_family_member_submit_button_action();
		bind_family_member_cancel_button_action();

		$("#person_is_alive").hide();
		$("#person_is_not_alive").hide();
		$("#estimated_age_select").hide();
		
		set_age_at_diagnosis_pulldown( "-- Select Estimated Age --", $("#estimated_age_select"));
		set_age_at_diagnosis_pulldown( "-- Select Estimated Age at Death --", $("#estimated_death_age_select"));

		set_disease_choice_select($("#cause_of_death_select"), $("#detailed_cause_of_death_select"));


		$("#age_determination").on("change", function () {
			if ($("#age_determination").val() == 'date_of_birth' || $("#age_determination").val() == 'age') {
				$("#age_determination_text").show();
				$("#estimated_age_select").hide();
			} else if ($("#age_determination").val() == 'estimated_age') {
				$("#age_determination_text").hide();
				$("#estimated_age_select").show();
			}
		});

		$("#is_person_alive").on("change", function () {
			if ($("#is_person_alive").val() == 'alive') {
				$("#person_is_alive").show();
				$("#person_is_not_alive").hide();
			} else if ($("#is_person_alive").val() == 'dead') {
				$("#person_is_alive").hide();
				$("#person_is_not_alive").show();
			} else if ($("#is_person_alive").val() == 'unknown') {
				$("#person_is_alive").hide();
				$("#person_is_not_alive").hide();
			}
		});
	});

	$("#update_family_member_health_history_dialog").dialog({
		title:"Enter Family Member's Health History",
		position:['middle',0],
		autoOpen: false,
		height:600,
		width:1000,
	});		

	$("#view_diagram_and_table_dialog").dialog({
		title:"View Pedigree Diagram",
		position:['middle',0],
		autoOpen: false,
		height:600,
		width:1000,
	});

    $("#family_pedigree").dialog({
        title:"Family Pedigree",
        position:['middle',0],
        autoOpen: false,
        height:1000,
        width:['95%'],
        backgroundColor: 'white'

    });

	// This page lets you load in a previously saved history
	$("#load_personal_history_dialog").load ("load_personal_history_dialog.html", function () {
		bind_load_personal_history_button();
	});

	$("#load_personal_history_dialog").dialog({
		title:"Load Your Family Health History",
		position:['middle',0],
		autoOpen: false,
		height:500,
		width:800,
	});

	// This page lets you load in a previously saved history
	$("#save_personal_history_dialog").load ("save_personal_history_dialog.html", function () {
		bind_save_personal_history_button();
		bind_save_xml();

	});

	$("#save_personal_history_dialog").dialog({
		title:"Save Your Family Health History",
		position:['middle',0],
		autoOpen: false,
		height:500,
		width:800,
	});

	// This is the second page when you are initially creating a personal history, it asks how many of each type of member
	$("#add_all_family_members_dialog").load ("add_all_family_members_dialog.html", function () {
		bind_add_all_family_members_submit_button_action();
		bind_add_all_family_members_cancel_button_action();
	});



	$("#add_all_family_members_dialog").dialog({
		title:"Add Immediate Family Members",
		position:['middle',0],
		autoOpen: false,
		height:400,
		width:600,
	});

    // family pedigree diagram dialog
    $("#family_pedigree").load ("family_pedigree.html", function () {});

	// Disease Risk Calculator
	$("#disease_risk_calculator").dialog({
		title:"Disease Risk Calculators",
		autoOpen: false,
		height:500,
		width:800,
	});

	$("#navRiskCalculator").on("click", function(){ 
		$("#disease_risk_calculator").dialog("open");
		load_risk_links();
	});

	// Below function is temporary to allow debuging of the pedigree
	$("#nav_help").on("click", function(){ 
		alert ("Personal Information:" + JSON.stringify(personal_information, null, 2) );
	});
	
	// Hide or show the right initial buttons
	$("#create_new_personal_history_button").show().on("click", bind_create_new_personal_history_button_action);
	$("#save_personal_history_button").show().on("click", bind_save_personal_history_button_action);
	$("#add_another_family_member_button").hide().on("click", bind_add_another_family_member_button_action);
	$("#save_family_history_button").hide();
//	$("#view_diagram_and_table_button").show().on("click", bind_view_diagram_and_table_button_action);
//    $("#view_diagram_and_table_button").show().on("click",  readtable());
    $("#your_health_risk_assessment_button").hide();
	
	

// Check to see if there are any specific actions
	if (getParameterByName("action") == 'load') {
			$("#load_personal_history_dialog").dialog("open");
	}	else if (getParameterByName("action") == 'save') {
			$("#save_personal_history_dialog").dialog("open");
	}

	
});

function bind_load_personal_history_button() {
	$("#file_upload_button").on("click", function () {

        $("#view_diagram_and_table_button").attr('onclick', 'xmlload()');



		personal_information = new Object();
		
		var fsize = $('#pedigree_file')[0].files[0].size;
//		alert ("Filename is (" + fsize + "): " + $("#pedigree_file").val());
		
		var reader = new FileReader();
		reader.readAsText($('#pedigree_file')[0].files[0], "UTF-8");
		reader.onload = loaded;

		$("#load_personal_history_dialog").dialog("close");
		
		return false;
	});
}

function bind_save_personal_history_button() {
	$("#file_download_button").on("click", function () {
		alert("Saving File");
		$("#save_personal_history_dialog").dialog("close");
		
		return false;
	});
}

function bind_create_new_personal_history_button_action () {
	if (personal_information != null) {
	    if (confirm("This will delete all data and restart,  Are you sure you want to do this?") == true) {
	    	personal_information = new Object();
	    	build_family_history_data_table();
	    } else {
	        return false;
	    }
	}
	$( "#add_personal_information_dialog" ).dialog( "open" );	
}

function bind_view_diagram_and_table_button_action () {
	$("#view_diagram_and_table_dialog").dialog("open");
	
	$("#view_diagram_and_table_dialog").append("Pedigree Diagram goes here");
}

function bind_save_personal_history_button_action () {
	$( "#save_personal_history_dialog" ).dialog( "open" );	
}

function bind_add_another_family_member_button_action() {
	var new_family_member_dialog;
	if ($("#new_family_member_dialog").length == 0) {
		new_family_member_dialog = $("<div id='new_family_member_dialog'>");
		new_family_member_dialog.dialog({
			title:"Define Family Member Relationship",
			height:220,
			width:500,
		});
	} else {
		new_family_member_dialog = $("#new_family_member_dialog");
		new_family_member_dialog.empty().dialog("open");
	}
	
	new_family_member_dialog.append("<h3> Who would you like to add to your history? </h3>");
	new_family_member_dialog.append("<P class='instructions'>Relatives in your immediate family who aren't listed here " +
			"are probably on the previous page and can be reached by closing this window and " +
			"selecting the plus sign image ('Add History') next to the relative's name. Spouses " +
			"and second cousins are not listed because they don't impact your family health history</P>");
	new_family_member_dialog.append("<B> Relationship to me: </B>");
	new_family_member_dialog.append($("<SELECT name='new_family_member_relationship'>")
		.append("<OPTION value=''> -- Select Relationship -- </OPTION>")
		.append("<OPTION value='aunt'> Aunt </OPTION>")
		.append("<OPTION value='uncle'> Uncle </OPTION>")
		.append("<OPTION value='daughter'> Daughter </OPTION>")
		.append("<OPTION value='son'> Son </OPTION>")
		.append("<OPTION value='brother'> (Full) Brother </OPTION>")
		.append("<OPTION value='sister'> (Full) Sister </OPTION>")
		.append("<OPTION value='cousin'> (First) Cousin </OPTION>")
		.append("<OPTION value='neice'> (Full) Neice </OPTION>")
		.append("<OPTION value='nephew'> (Full) Nephew </OPTION>")
		.append("<OPTION value='granddaughter'> Granddaughter </OPTION>")
		.append("<OPTION value='grandson'> Grandson </OPTION>")
		.append("<OPTION value='halfsister'> Half Sister </OPTION>")
		.append("<OPTION value='halfbrother'> Half Brother </OPTION>")
		.on("change", new_family_member_relationship_selection_change_action)
	);
	
}

function new_family_member_relationship_selection_change_action() {
	
	// For some of the selects, we need to ask additional information
	relationship = $(this).val();
	new_family_member_dialog = $("#new_family_member_dialog");

	// Must remove current exact relationship if there is one.
	$("#new_family_member_exact_relationship").remove();
	$("#exact_relationship_label").remove();
	
	switch (relationship) {
		case 'aunt':

			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> Who is the aunt related to?: </B> </span>");
			new_family_member_dialog.append($("<SELECT id='new_family_member_exact_relationship'>")
				.append("<OPTION value=''> -- Please Specify -- </OPTION>")
				.append("<OPTION value='maternal_aunt'> Mother </OPTION>")
				.append("<OPTION value='paternal_aunt'> Father </OPTION>")
				.on("change", exact_family_member_relationship_selection_change_action)
			);
			break;
		case 'uncle':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> Who is the uncle related to?: </B> </span>");
			new_family_member_dialog.append($("<SELECT id='new_family_member_exact_relationship'>")
				.append("<OPTION value=''> -- Please Specify -- </OPTION>")
				.append("<OPTION value='maternal_uncle'> Mother </OPTION>")
				.append("<OPTION value='paternal_uncle'> Father </OPTION>")
				.on("change", exact_family_member_relationship_selection_change_action)
			);
			break;
		case 'daughter':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='daughter'>");
			exact_family_member_relationship_selection_change_action();
			break;
		case 'son':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='son'>");
			exact_family_member_relationship_selection_change_action();
			break;
		case 'brother':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='brother'>");
			exact_family_member_relationship_selection_change_action();
			break;
		case 'sister':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='sister'>");
			exact_family_member_relationship_selection_change_action();
			break;
		// Below needs to be fixed using real people defined from pedigree
		case 'cousin':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> Who is the parent of your first cousin: </B> </span>");
			new_family_member_dialog.append($("<SELECT id='new_family_member_exact_relationship'>")
				.append("<OPTION value=''> -- Please Specify -- </OPTION>")
				.append("<OPTION value='maternal_cousin'> Mother's Side </OPTION>")
				.append("<OPTION value='paternal_cousin'> Father's Side </OPTION>")
				.on("change", exact_family_member_relationship_selection_change_action)
			);
			break;
		// Below needs to be fixed using real people defined from pedigree
		case 'neice':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='neice'>");
			exact_family_member_relationship_selection_change_action();
			break;
			// Below needs to be fixed using real people defined from pedigree
		case 'nephew':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='nephew'>");
			exact_family_member_relationship_selection_change_action();
			break;
			// Below needs to be fixed using real people defined from pedigree
		case 'granddaughter':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='granddaughter'>");
			exact_family_member_relationship_selection_change_action();
			break;
			// Below needs to be fixed using real people defined from pedigree
		case 'grandson':
			new_family_member_dialog.append("<INPUT id='new_family_member_exact_relationship' type='hidden' value='grandson'>");
			exact_family_member_relationship_selection_change_action();
			break;
		case 'halfbrother':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> Who is the parent of your half brother: </B> </span>");
			new_family_member_dialog.append($("<SELECT id='new_family_member_exact_relationship'>")
				.append("<OPTION value=''> -- Please Specify -- </OPTION>")
				.append("<OPTION value='maternal_halfbrother'> Mother </OPTION>")
				.append("<OPTION value='paternal_halfbrother'> Father </OPTION>")
				.on("change", exact_family_member_relationship_selection_change_action)
			);
			break;
		case 'halfsister':
			new_family_member_dialog.append("<span id='exact_relationship_label'> <br/> <B> Who is the parent of your half sister: </B> </span>");
			new_family_member_dialog.append($("<SELECT id='new_family_member_exact_relationship'>")
				.append("<OPTION value=''> -- Please Specify -- </OPTION>")
				.append("<OPTION value='maternal_halfsister'> Mother </OPTION>")
				.append("<OPTION value='paternal_halfsister'> Father </OPTION>")
				.on("change", exact_family_member_relationship_selection_change_action)
			);
			break;
	}
}

function exact_family_member_relationship_selection_change_action() {
	relationship = $("#new_family_member_exact_relationship").val();
	// for dynamic relationships, they all have _#, we need to find the first empty one to use
	
	if (personal_information == null) {
		alert("No Personal Information Set yet");
		return
	}
	
	var i=0;
	while (personal_information[relationship + "_" + i] != null) i++;
	
	current_relationship = relationship + "_" + i;
//	alert ("Exact Relationship ID: " + current_relationship);
	
	family_member_information = new Object();
	family_member_information.gender = 'MALE';
	personal_information[current_relationship] = family_member_information;
	
	var table = $("#history_summary_table");
	add_new_family_history_row(table, "", relationship_to_label[relationship], current_relationship, false, true);

	clear_and_set_current_family_member_health_history_dialog(family_member_information);
	$("#new_family_member_dialog").dialog("close");
	$( "#update_family_member_health_history_dialog" ).dialog( "open" );
	
}

function bind_personal_submit_button_action () {
	$("#addPersonInformationSubmitButton").on("click", function(){ 
		
		// Determine the values from the form
		if (personal_information == null) personal_information = new Object();
		personal_information['name'] = $("#personal_info_form_name").val();
		personal_information['gender'] = $('input[name="person.gender"]:checked').val();
		personal_information['date_of_birth'] = $('#personal_info_form_date_of_birth').val();
		personal_information['twin_status'] = $('input[name="person.twin_status"]:checked').val();
		personal_information['adopted'] = $('input[name="person.adopted"]:checked').val();
		
		if (parseInt($('#personal_height_inches').val()) > 0 || parseInt($('#personal_height_feet').val()) ) {
			personal_information['height'] = parseInt($('#personal_height_feet').val()) * 12 + parseInt($('#personal_height_inches').val());
			personal_information['height_unit'] = 'inches';
		} else if ($('#personal_height_centimeters').val() > 0) {
			personal_information['height'] = parseInt($('#personal_height_centimeters').val());
			personal_information['height_unit'] = 'centimeters';
		} 
		personal_information['weight'] = $('#personal_weight').val();
		personal_information['weight_unit'] = $('#personal_weight_unit').val();

		personal_information['Health History'] = current_health_history;

		personal_information['consanguinity'] = $("#personal_race_ethnicity").find('input[name="person.consanguinity"]:checked').val();
		
		// Use #personal_race_ethnicity
		personal_information['race'] = new Object();
		personal_information['race']['American Indian or Alaska Native'] = $("#personal_race_ethnicity").find("#selectedRaces-1").is(':checked');
		personal_information['race']['Asian'] = $("#personal_race_ethnicity").find("#selectedRaces-2").is(':checked');
		personal_information['race']['Black or African-American'] = $("#personal_race_ethnicity").find("#selectedRaces-3").is(':checked');
		personal_information['race']['Native Hawaiian or Other Pacific Islander'] = $("#personal_race_ethnicity").find("#selectedRaces-4").is(':checked');
		personal_information['race']['White'] = $("#personal_race_ethnicity").find("#selectedRaces-5").is(':checked');

		personal_information['ethnicity'] = new Object();
		personal_information['ethnicity']['Hispanic or Latino'] = $("#personal_race_ethnicity").find("#selectedEthnicities-1").is(':checked');
		personal_information['ethnicity']['Ashkenazi Jewish'] = $("#personal_race_ethnicity").find("#selectedEthnicities-2").is(':checked');
		personal_information['ethnicity']['Not Hispanic or Latino'] = $("#personal_race_ethnicity").find("#selectedEthnicities-3").is(':checked');


		
//		build_family_history_data_table();
		$("#add_personal_information_dialog").dialog("close");
		
		//  If there already is a father object, then this is an update, do not try and recreate relatives
		if (personal_information['father'] == null) {
			$("#add_all_family_members_dialog").dialog("open");
		} else {
			update_personal_history_row();
		}
	});	
}

function bind_personal_cancel_button_action () {
	$("#addPersonInformationCancelButton").on("click", function(){ 
		$("#add_personal_information_dialog").dialog("close");
	});
}

function bind_family_member_submit_button_action () {
	
	$("#addFamilyMemberSubmitButton").on("click", function(){ 
		var family_member_information = new Object();
		family_member_information['name'] = $("#family_member_info_form_name").val();
		family_member_information['gender'] = $('input[name="family.member.gender"]:checked').val();
		family_member_information['twinStatus'] = $('input[name="family.member.twin_status"]:checked').val();
		family_member_information['adopted'] = $('input[name="family.member.adopted"]:checked').val();

		// Cause of Death or Age/Estimated-Age
		var alive_flag = $("#is_person_alive").val();
		var age_determination_flag = $('#age_determination').val();
		var age_determination_text = $('#age_determination_text').val();
		var estimated_age = $('#estimated_age_select').val();
		var cause_of_death = $('#cause_of_death_select').val();
		var detailed_cause_of_death = $('#detailed_cause_of_death_select').val();
		var estimated_death_age = $('#estimated_death_age_select').val();
		
		if (alive_flag == 'alive') {
			if (age_determination_flag == 'date_of_birth') {
				family_member_information['date_of_birth'] = age_determination_text;
			} else if (age_determination_flag == 'age') {
				family_member_information['age'] = age_determination_text;
			}	else if (age_determination_flag == 'estimated_age') {
				family_member_information['estimated_age'] = estimated_age;
			}
		} else if (alive_flag == 'dead') {
				family_member_information['cause_of_death'] = cause_of_death;
				family_member_information['detailed_cause_of_death'] = detailed_cause_of_death;
				family_member_information['estimated_death_age'] = estimated_death_age;			
		}

		if ($('#age_determinion').val() == 'Age') family_member_information['age'] = $('#age_determinion_text').val();
		var date_of_birth = $('#age_determinion_text').val();
		
		family_member_information['Health History'] = current_health_history;

		family_member_information['race'] = new Object();
		family_member_information['race']['American Indian or Alaska Native'] = $("#family_race_ethnicity").find("#selectedRaces-1").is(':checked');
		family_member_information['race']['Asian'] = $("#family_race_ethnicity").find("#selectedRaces-2").is(':checked');
		family_member_information['race']['Black or African-American'] = $("#family_race_ethnicity").find("#selectedRaces-3").is(':checked');
		family_member_information['race']['Native Hawaiian or Other Pacific Islander'] = $("#family_race_ethnicity").find("#selectedRaces-4").is(':checked');
		family_member_information['race']['White'] = $("#family_race_ethnicity").find("#selectedRaces-5").is(':checked');

		family_member_information['ethnicity'] = new Object();
		family_member_information['ethnicity']['Hispanic or Latino'] = $("#family_race_ethnicity").find("#selectedEthnicities-1").is(':checked');
		family_member_information['ethnicity']['Ashkenazi Jewish'] = $("#family_race_ethnicity").find("#selectedEthnicities-2").is(':checked');
		family_member_information['ethnicity']['Not Hispanic or Latino'] = $("#family_race_ethnicity").find("#selectedEthnicities-3").is(':checked');
		
		personal_information[current_relationship] = family_member_information;

		update_family_history_row(current_relationship, family_member_information);
		
		
		$("#update_family_member_health_history_dialog").dialog("close");
	});	
}

function bind_family_member_cancel_button_action () {
	$("#addFamilyMemberCancelButton").on("click", function(){ 
//		alert ("Cancelling Family Member Information");
		$("#update_family_member_health_history_dialog").dialog("close");
	});
}

function bind_add_all_family_members_submit_button_action() {
	$("#create_immediate_family_submit").on("click", function(){ 
		var number_brothers = parseInt($("#family_brothers").val()) || 0;
		var number_sisters = parseInt($("#family_sisters").val()) || 0;
		var number_sons = parseInt( $("#family_sons").val()) || 0;
		var number_daughters = parseInt($("#family_daughters").val()) || 0;
		var number_maternal_uncles = parseInt($("#family_maternal_uncles").val()) || 0;
		var number_maternal_aunts = parseInt($("#family_maternal_aunts").val()) || 0;
		var number_paternal_uncles = parseInt($("#family_paternal_uncles").val()) || 0;
		var number_paternal_aunts = parseInt($("#family_paternal_aunts").val()) || 0;
		
//		personal_information['father'] = new Object();
//		personal_information['mother'] = new Object();
//		personal_information['maternal_grandfather'] = new Object();
//		personal_information['maternal_grandmother'] = new Object();
//		personal_information['paternal_grandfather'] = new Object();
//		personal_information['paternal_grandmother'] = new Object();
		for (var i=0; i<number_brothers;i++) personal_information['brother_' + i] = new Object();
		for (var i=0; i<number_sisters;i++) personal_information['sister_' + i] = new Object();
		for (var i=0; i<number_sons;i++) personal_information['son_' + i] = new Object();
		for (var i=0; i<number_daughters;i++) personal_information['daughter_' + i] = new Object();
		for (var i=0; i<number_maternal_uncles;i++) personal_information['maternal_uncle_' + i] = new Object();
		for (var i=0; i<number_maternal_aunts;i++) personal_information['maternal_aunt_' + i] = new Object();
		for (var i=0; i<number_paternal_uncles;i++) personal_information['paternal_uncle_' + i] = new Object();
		for (var i=0; i<number_paternal_aunts;i++) personal_information['paternal_aunt_' + i] = new Object();
		build_family_history_data_table();

		$("#add_another_family_member_button").show();

		$("#add_all_family_members_dialog").dialog("close");
	});
	
}

function bind_add_all_family_members_cancel_button_action() {
	$("#create_immediate_family_cancel").on("click", function(){ 
		alert ("Cancelling Adding of Family Members");
		$("#add_all_family_members_dialog").dialog("close");
	});	
}

function load_risk_links() {
	$.getJSON( "./risk/risks.json", function( data ) {
		$("#risk_section").empty();
        $.each(data, function(index) {
            var risk_calculator = $("#risk_section").append($("<div class='assessmentContainer risk_calculator' href='" + data[index].link + "'>")
            	.append($("<h3></h3>").append(data[index].name))
            	.append($("<P>").append(data[index].description)));
            
            $("#risk_section").append(risk_calculator).append("<br>");
        });
        
        $(".risk_calculator").on("click", function() { 
        	$( "#risk_section" ).load( "risk/" + $(this).attr("href"), function(data) {
        		$(data).find("[pullfrom]").each(function (i, field) {
        			var pullfrom = $(field).attr("pullfrom");
        			var v = personal_information[pullfrom];
        			
        			// Do not know why using field directly doesn't work but this does
        			$("#" + $(field).attr("id")).val(v);
            	});
        	});        	
        });
	});
}


function build_family_history_data_table () {
	var table = $("#history_summary_table");
	
	add_family_history_header_row(table);
	
	add_personal_history_row(table, personal_information['name'], "Self", "self", true, false);
	add_new_family_history_row(table, personal_information.father, "Father", "father", false);	
	add_new_family_history_row(table, personal_information.mother, "Mother", "mother", false);
	add_new_family_history_row(table, personal_information.paternal_grandfather, "Paternal Grandfather", "paternal_grandfather", false);	
	add_new_family_history_row(table, personal_information.paternal_grandmother, "Paternal Grandmother", "paternal_grandmother", false);
	add_new_family_history_row(table, personal_information.maternal_grandfather, "Maternal Grandfather", "maternal_grandfather", false);
	add_new_family_history_row(table, personal_information.maternal_grandmother, "Maternal Grandmother", "maternal_grandmother", false);

	var i = 0;
	while (personal_information['brother_' + i] != null) {
		add_new_family_history_row(table, personal_information['brother_' + i], "Brother", "brother_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['sister_' + i] != null) {
		add_new_family_history_row(table, personal_information['sister_' + i], "Sister", "sister_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['son_' + i] != null) {
		add_new_family_history_row(table, personal_information['son_' + i], "Son", "son_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['daughter_' + i] != null) {
		add_new_family_history_row(table, personal_information['daughter_' + i], "Daughter", "daughter_" + i, true);
		i++;
	}

	i = 0;
	while (personal_information['maternal_uncle_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_uncle_' + i], "Maternal Uncle", "maternal_uncle_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['maternal_aunt_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_aunt_' + i], "Maternal Aunt", "maternal_aunt_" + i, true);
		i++;
	}

	
	i = 0;
	while (personal_information['paternal_uncle_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_uncle_' + i], "Paternal Uncle", "paternal_uncle_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['paternal_aunt_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_aunt_' + i], "Paternal Aunt", "paternal_aunt_" + i, true);
		i++;
	}
	
	i = 0;
	while (personal_information['maternal_cousin_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_cousin_' + i], "Maternal Cousin", "maternal_cousin_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['paternal_cousin_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_cousin_' + i], "Paternal Cousin", "paternal_cousin_" + i, true);
		i++;
	}

	i = 0;
	while (personal_information['niece_' + i] != null) {
		add_new_family_history_row(table, personal_information['niece_' + i], "Niece", "niece_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['nephew_' + i] != null) {
		add_new_family_history_row(table, personal_information['nephew_' + i], "Nephew", "nephew_" + i, true);
		i++;
	}

	i = 0;
	while (personal_information['grandson_' + i] != null) {
		add_new_family_history_row(table, personal_information['grandson_' + i], "Grandson", "grandson_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['granddaughter_' + i] != null) {
		add_new_family_history_row(table, personal_information['granddaughter_' + i], "Granddaughter", "granddaughter_" + i, true);
		i++;
	}

	var i = 0;
	while (personal_information['maternal_halfbrother_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_halfbrother_' + i], "Maternal Halfbrother", "maternal_halfbrother_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['maternal_halfsister_' + i] != null) {
		add_new_family_history_row(table, personal_information['maternal_halfsister_' + i], "Maternal Halfsister", "maternal_halfsister_" + i, true);
		i++;
	}
	var i = 0;
	while (personal_information['paternal_halfbrother_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_halfbrother_' + i], "Paternal Halfbrother", "paternal_halfbrother_" + i, true);
		i++;
	}
	i = 0;
	while (personal_information['paternal_halfsister_' + i] != null) {
		add_new_family_history_row(table, personal_information['paternal_halfsister_' + i], "Paternal Halfsister", "paternal_halfsister_" + i, true);
		i++;
	}

}

function add_family_history_header_row(table) {
	var header_row = $("<tr></tr>");
	header_row.append("<th scope='col' class='nowrap'>Name</th>");
	header_row.append("<th scope='col' abbr='Relationship' class='nowrap'>Relationship to Me</th>");
	header_row.append("<th scope='col' abbr='Add' class='nowrap'>Add History</th>");
	header_row.append("<th scope='col' abbr='Update' class='nowrap'>Update History</th>");
	header_row.append("<th scope='col' abbr='Remove' class='nowrap'>Remove Relative</th>");
	header_row.append("");
	table.empty().append(header_row);
}

function add_personal_history_row(table) {
	
	// Html requires that all blank fields have at least 1 char or it will not show border
	name = 'Self';	
	var new_row = $("<tr id='self'></tr>");
	new_row.addClass("proband");
	new_row.append("<td class='information' id='relatives_name'>" + personal_information.name + "</td>");
	new_row.append("<td class='information' > Self </td>");
	new_row.append("<td class='action add_history'>&nbsp;</td>");
	
	var update_history = $("<td class='action update_history'><img src='../images/icon_edit.gif' alt='Update History' title='Update History'></td>");

	update_history.on("click", function() { 
		current_relationship = 'self';
		clear_and_set_personal_health_history_dialog();
		$( "#add_personal_information_dialog" ).dialog( "open" );
	});		
	new_row.append(update_history);
	
	new_row.append("<td class='action remove_history'>&nbsp;</td>");

	table.append(new_row);
}

function add_new_family_history_row(table, family_member, relationship, relationship_id, is_removeable) {
	
	// Html requires that all blank fields have at least 1 char or it will not show border

	var name;
	if (family_member == null || family_member.name == "" || $.isEmptyObject(family_member) ) name = "&nbsp;";
	else name = family_member.name;
	
	var is_already_defined = (family_member != null && !($.isEmptyObject(family_member)));
	if (relationship == "") relationship = "&nbsp;";
	
	var new_row = $("<tr id='" + relationship_id + "'></tr>");
	new_row.addClass("proband");
	new_row.append("<td class='information' id='relatives_name'>" + name + "</td>");
	new_row.append("<td class='information' >" + relationship + "</td>");
	if (is_already_defined) {
		new_row.append("<td class='action add_history'>&nbsp;</td>");
		var update_history = $("<td class='action update_history'><img src='../images/icon_edit.gif' alt='Update History' title='Update History'></td>");
		update_history.attr("relationship_id", relationship_id);

		update_history.on("click", function(){ 
//			alert("Updating history for: " + $(this).attr('relationship_id') );
			//			$( "#addPersonalInformation" ).dialog( "open" );

			family_member = personal_information[$(this).attr('relationship_id')];
			current_relationship = $(this).attr('relationship_id');
			clear_and_set_current_family_member_health_history_dialog(family_member);
			$( "#update_family_member_health_history_dialog" ).dialog( "open" );
		});
		
		new_row.append(update_history);
		
		
	} else {
		var add_history = $("<td class='action add_history'><img src='../images/icon_add.gif' alt='Add History' title='Add History'></td>")

		add_history.on("click", function(){ 
//			alert("Updating history for: " + relationship)
			$("#accordian_title_relationship").html(" <h2> Your " + relationship + "'s Health Information</h2>");
			
			current_relationship = relationship_id;
			clear_family_member_health_history_dialog();
			$( "#update_family_member_health_history_dialog" ).dialog( "open" );
		});

		
		new_row.append(add_history);
		new_row.append("<td class='action update_history'>&nbsp;</td>");
	}
	if (is_removeable) {
		var remove_history = $("<td class='action remove_history'><img src='../images/icon_trash.gif' alt='Remove History' title='Remove History'></td>")
		remove_history.attr("relationship_id", relationship_id);
		remove_history.on("click", function(){ 
//			alert("Removing Family Member for: " + $(this).attr('relationship_id') );
			remove_family_member( $(this).attr('relationship_id'));
			
			//			$( "#addPersonalInformation" ).dialog( "open" );
		});
		
		new_row.append(remove_history);
	} else new_row.append("<td class='action remove_history'>&nbsp;</td>");

	table.append(new_row);
}

function remove_family_member(relationship_id) {
	
	var name = personal_information[relationship_id]['name'];
	if (name == "") name = relationship_id;
	var should_remove_family_member = confirm("Do you really want to remove " + name + "?");
	if (should_remove_family_member == true) {
		delete personal_information[relationship_id];
		$("#" + relationship_id).remove();
	} else {
		// DO nothing
	}
	
}

function update_family_history_row(relationship_id, family_member_information) {
	$("#" + relationship_id).find("#relatives_name").html(family_member_information["name"]);

//	var update_history = $("<td class='action update_history' relationship_id='" + relationship_id 
//				+ "' ><img src='images/icon_edit.gif' alt='Update History' title='Update History'></td>");

	$("#" + relationship_id).find(".update_history").html("<img src='../images/icon_edit.gif' alt='Update History' title='Update History'>");
	$("#" + relationship_id).find(".update_history").attr("relationship_id", relationship_id);
	$("#" + relationship_id).find(".add_history").html("&nbsp;");
	
	$("#" + relationship_id).find(".update_history").unbind().on("click", function(){
		family_member = personal_information[$(this).attr('relationship_id')];
		clear_and_set_current_family_member_health_history_dialog(family_member);
		$( "#update_family_member_health_history_dialog" ).dialog( "open" );
	});

	$("#" + relationship_id).find(".add_history").off("click");
	
}

function update_personal_history_row() {
	$("#self").find("#relatives_name").html(personal_information.name);
}

function build_history_edit_dialog () {
	
}


//  Information Sections

function build_family_health_information_section() {
	var information = $("#family_health_information");
	// First put up accordion entry
	var bar = $("<div class='title-bar' id='hi-title'>");
	bar.append("Your Family's Health Information");
	information.empty().append(bar);
	information.append($("<p class='instructions'>In the list below, select a Disease or Condition (if any) from the dropdown box. " +
	"Then select the Age at Diagnosis and press the Add button. You may repeat this process as necessary.</p>"))

	var hi_health_history_table = $("<table class='disease_table'>");
	var hi_header_row = $("<tr>");
	hi_header_row.append("<th>Disease or Condition</th>");
	hi_header_row.append("<th>Age at Diagnosis</th>");
	hi_header_row.append("<th>Action</th>");
	hi_health_history_table.append(hi_header_row);

	var hi_data_entry_row = $("<tr id='health_data_entry_row'>");

	var disease_select = $("<select id='disease_choice_select' name='disease_choice_select'></select>");
	var	detailed_disease_select = $("<select id='detailed_disease_choice_select' name='detailed_disease_choice_select'></select>");
	
	set_disease_choice_select(disease_select, detailed_disease_select);
	hi_data_entry_row.append($("<td>").append(disease_select).append("<br />&nbsp;&nbsp;").append(detailed_disease_select));
	

//	var disease_choices = get_disease_choice_select();
//	hi_data_entry_row.append($("<td>").append(disease_choices).append("<br />&nbsp;&nbsp;"));
	
	var age_at_diagnosis_select = $("<select name='age_at_diagnosis_select' id='age_at_diagnosis_select'></select>");
	set_age_at_diagnosis_pulldown(" --Select Age at Diagnosis -- ", age_at_diagnosis_select);
	hi_data_entry_row.append($("<td>").append(age_at_diagnosis_select));
	
	var add_new_disease_button = $("<button id='family_add_new_disease_button' name='Add' value'Add'> Add </button>");
	add_new_disease_button.on('click', add_disease);

	
	hi_data_entry_row.append($("<td>").append(add_new_disease_button) );
	hi_health_history_table.append(hi_data_entry_row);
	
	
	information.append(hi_health_history_table);
	information.append("<br />");

}


function build_personal_health_information_section() {
	var information = $("#personal_health_information");
	// First put up accordion entry
	var bar = $("<div class='title-bar' id='hi-title'>");
	bar.append("Your Health Information");
	information.empty().append(bar);
	
	information.append($("<p class='instructions'>In the list below, select a Disease or Condition (if any) from the dropdown box. " +
			"Then select the Age at Diagnosis and press the Add button. You may repeat this process as necessary.</p>"))
	
	var hi_health_history_table = $("<table class='disease_table'>");
	var hi_header_row = $("<tr>");
	hi_header_row.append("<th>Disease or Condition</th>");
	hi_header_row.append("<th>Age at Diagnosis</th>");
	hi_header_row.append("<th>Action</th>");
	hi_health_history_table.append(hi_header_row);

	var hi_data_entry_row = $("<tr id='health_data_entry_row'>");

	var disease_select = $("<select id='disease_choice_select' name='disease_choice_select'></select>");
	var	detailed_disease_select = $("<select id='detailed_disease_choice_select' name='detailed_disease_choice_select'></select>");
	
	set_disease_choice_select(disease_select, detailed_disease_select);
	hi_data_entry_row.append($("<td>").append(disease_select).append("<br />&nbsp;&nbsp;").append(detailed_disease_select));

	var age_at_diagnosis_select = $("<select name='age_at_diagnosis_select' id='age_at_diagnosis_select'></select>");
	set_age_at_diagnosis_pulldown(" --Select Age at Diagnosis--", age_at_diagnosis_select);	
	hi_data_entry_row.append($("<td>").append(age_at_diagnosis_select));
	
	var add_new_disease_button = $("<button id='add_new_disease_button' name='Add' value'Add'> Add </button>");
	add_new_disease_button.on('click', add_disease);

	
	hi_data_entry_row.append($("<td>").append(add_new_disease_button) );
	hi_health_history_table.append(hi_data_entry_row);
	
	information.append(hi_health_history_table);
	information.append("<br />");
}


function set_disease_choice_select (disease_select, detailed_disease_select) {
	detailed_disease_select.hide();
	disease_select.append("<option value='none'> Please Select a Disease </option>");
	for (disease_name in diseases) {
		disease_select.append("<option> " + disease_name + " </option>");		
	}
	
	disease_select.on('change', function() {
		var chosen_disease_name = $.trim($(this).find("option:selected" ).text());
		var disease_box = disease_select.parent();
//		$(this).next().remove();
//		$("#detailed_disease_choice_select").remove();
		detailed_disease = get_detailed_disease(chosen_disease_name);
		detailed_disease_select.empty().hide();
		var detailed_disease_list = "";
		if (detailed_disease.length > 0) {
//			disease_box.append(detailed_disease_select);
			detailed_disease_select.show().append("<option value='none'> Please Select a Specific Subtype </option>");
			
			for (var i = 0; i < detailed_disease.length;i++) {
				detailed_disease_select.append("<option> " + detailed_disease[i] + " </option>");					
			}			
		}
	});
	return disease_select;
}

function get_detailed_disease (disease_name) {
	return diseases[disease_name];
}

function set_age_at_diagnosis_pulldown(instructions, age_at_diagnosis_select) {
	age_at_diagnosis_select.append("<option value='Unknown'> "+instructions+"  </option>");
	age_at_diagnosis_select.append("<option> Pre-Birth </option>");
	age_at_diagnosis_select.append("<option> Newborn </option>");
	age_at_diagnosis_select.append("<option> In Infancy </option>");
	age_at_diagnosis_select.append("<option> In Childhood </option>");
	age_at_diagnosis_select.append("<option> In Adolescence </option>");
	age_at_diagnosis_select.append("<option> 20-29 years </option>");
	age_at_diagnosis_select.append("<option> 30-39 years </option>");
	age_at_diagnosis_select.append("<option> 40-49 years </option>");
	age_at_diagnosis_select.append("<option> 50-59 years </option>");
	age_at_diagnosis_select.append("<option> 60 years or older </option>");
	age_at_diagnosis_select.append("<option> Unknown </option>");
	
	return age_at_diagnosis_select;
}

function add_disease() {
//	alert($(this).parent().parent().parent().html());
	var disease_name = $(this).parent().parent().find("#disease_choice_select").val();
	var disease_detail = $(this).parent().parent().find("#detailed_disease_choice_select").val();
	var age_at_diagnosis = $(this).parent().parent().find("#age_at_diagnosis_select").val();
	
	specific_health_issue = {"Disease Name": disease_name,
	                          "Detailed Disease Name": disease_detail,
	                          "Age At Diagnosis": age_at_diagnosis};
	current_health_history.push(specific_health_issue);
	var row_number = current_health_history.length;
	
	var new_row = create_disease_row(disease_name, disease_detail, age_at_diagnosis);
	$(this).parent().parent().parent().find("#health_data_entry_row").before(new_row);
	
	// Reset the fields
	$(this).parent().parent().find("#disease_choice_select").val($(this).parent().parent().find("#disease_choice_select").find('option').first().val());
	$(this).parent().parent().find("#detailed_disease_choice_select").empty().hide();
//	$(this).parent().parent().find("#detailed_disease_choice_select").val($(this).parent().parent().find("#detailed_disease_choice_select").find('option').first().val());
	$(this).parent().parent().find("#age_at_diagnosis_select").val($(this).parent().parent().find("#age_at_diagnosis_select").find('option').first().val());
	
//	alert ("Adding: " + disease_name + ":" + disease_detail + ":" + age_at_diagnosis);
	return false;
}

function create_disease_row(disease_name, disease_detail, age_at_diagnosis) {
	var new_row=$("<tr class='disease_detail'>");
	if (disease_detail != null && disease_detail != 'none') {
		new_row.append("<td>" + disease_detail + "</td>");
	} else {
		new_row.append("<td>" + disease_name + "</td>");		
	}
	new_row.append("<td>" + age_at_diagnosis + "</td>");
	
	var remove_disease_button = $("<button id='remove_disease_button'> Remove </button>");
	remove_disease_button.on('click', remove_disease);
	new_row.append($("<td>").append(remove_disease_button));
	return new_row;
}

function remove_disease() {
	var row_number = $(this).attr("row_number");

	// row_number starts at 1, the array starts at 0 so we need to subtract 1
	current_health_history.splice(row_number-1, 1);	
	
	$(this).parent().parent().remove();
//	alert ("Removing Disease Row: " + row_number);
	
	
	return false;
}

// Family Background Section

// Health Information Section

function build_personal_race_ethnicity_section() {
	var race_ethnicity = $("#personal_race_ethnicity");
	// First put up accordion entry
	var bar = $("<div class='title-bar'>Your Family Background Information</div>");
	race_ethnicity.empty().append(bar);
	
	
	var race_checkboxes = $("<td>" +
			"<input tabindex='21' name='selectedRaces' value='1' id='selectedRaces-1'  type='checkbox'>" +
			"<label for='selectedRaces-1' class='checkboxLabel'>American Indian or Alaska Native</label>" +
			"<input tabindex='21' name='selectedRaces' value='2' id='selectedRaces-2' type='checkbox'>" +
			"<label for='selectedRaces-2' class='checkboxLabel'>Asian</label>" +
			"<input tabindex='21' name='selectedRaces' value='3' id='selectedRaces-3' type='checkbox'>" +
			"<label for='selectedRaces-3' class='checkboxLabel'>Black or African-American</label>" +
		    "<br>" +
			"<input tabindex='21' name='selectedRaces' value='4' id='selectedRaces-4'  type='checkbox'>" +
			"<label for='selectedRaces-4' class='checkboxLabel'>Native Hawaiian or Other Pacific Islander</label>" +
			"<input tabindex='21' name='selectedRaces' value='5' id='selectedRaces-5'  type='checkbox'>" +
			"<label for='selectedRaces-5' class='checkboxLabel'>White</label>" +
			"</td>");

	var ethnicity_checkboxes = $("<td>" +
			"<input tabindex='24' name='selectedEthnicities' value='1' id='selectedEthnicities-1' type='checkbox'>" +
			"<label for='selectedEthnicities-1' class='checkboxLabel'>Hispanic or Latino</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='2' id='selectedEthnicities-2' type='checkbox'>" +
			"<label for='selectedEthnicities-2' class='checkboxLabel'>Ashkenazi Jewish</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='3' id='selectedEthnicities-3' type='checkbox'>" +
			"<label for='selectedEthnicities-3' class='checkboxLabel'>Not Hispanic or Latino</label>" +
			"</td>");

	race_ethnicity.
		append($("<table>")
				.append($("<tr>")
						.append("<td colspan='2'>Check here if your parents are related to each other in any way other than marriage.</td>")
						.append("<td><input name='person.consanguinity' value='true' tabindex='20' " +
									"id='person_consanguinity' type='checkbox'></td>"))
				.append($("<tr>")
						.append("<td colspan='2'>Multiple races and ethnicities may be selected.</td>") )
				.append($("<tr>")
						.append("<td>Race:</td>")
						.append(race_checkboxes) )
				.append($("<tr>")
						.append("<td> Ethnicity </td>")
						.append(ethnicity_checkboxes))
				.append($("<tr>")
						.append("<td colspan='2'><a tabindex='29' href='#' >Why are we asking about Ashkenazi Jewish heritage?</a></td>")));
	
}

function build_family_race_ethnicity_section() {
	var race_ethnicity = $("#family_race_ethnicity");
	// First put up accordion entry
	var bar = $("<div class='title-bar'>This Person's Family Background Information</div>");
	race_ethnicity.empty().append(bar);
	
	
	var race_checkboxes = $("<td>" +
			"<input tabindex='21' name='selectedRaces' value='1' id='selectedRaces-1'  type='checkbox'>" +
			"<label for='selectedRaces-1' class='checkboxLabel'>American Indian or Alaska Native</label>" +
			"<input tabindex='21' name='selectedRaces' value='2' id='selectedRaces-2' type='checkbox'>" +
			"<label for='selectedRaces-2' class='checkboxLabel'>Asian</label>" +
			"<input tabindex='21' name='selectedRaces' value='3' id='selectedRaces-3' type='checkbox'>" +
			"<label for='selectedRaces-3' class='checkboxLabel'>Black or African-American</label>" +
		    "<br>" +
			"<input tabindex='21' name='selectedRaces' value='4' id='selectedRaces-4'  type='checkbox'>" +
			"<label for='selectedRaces-4' class='checkboxLabel'>Native Hawaiian or Other Pacific Islander</label>" +
			"<input tabindex='21' name='selectedRaces' value='5' id='selectedRaces-5'  type='checkbox'>" +
			"<label for='selectedRaces-5' class='checkboxLabel'>White</label>" +
			"</td>");

	var ethnicity_checkboxes = $("<td>" +
			"<input tabindex='24' name='selectedEthnicities' value='1' id='selectedEthnicities-1' type='checkbox'>" +
			"<label for='selectedEthnicities-1' class='checkboxLabel'>Hispanic or Latino</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='2' id='selectedEthnicities-2' type='checkbox'>" +
			"<label for='selectedEthnicities-2' class='checkboxLabel'>Ashkenazi Jewish</label>" +
			"<input tabindex='24' name='selectedEthnicities' value='3' id='selectedEthnicities-3' type='checkbox'>" +
			"<label for='selectedEthnicities-3' class='checkboxLabel'>Not Hispanic or Latino</label>" +
			"</td>");

	race_ethnicity.
		append($("<table>")
				.append($("<tr>")
						.append("<td colspan='2'>Multiple races and ethnicities may be selected.</td>") )
				.append($("<tr>")
						.append("<td>Race:</td>")
						.append(race_checkboxes) )
				.append($("<tr>")
						.append("<td> Ethnicity </td>")
						.append(ethnicity_checkboxes))
				.append($("<tr>")
						.append("<td colspan='2'><a tabindex='29' href='#' >Why are we asking about Ashkenazi Jewish heritage?</a></td>")));
	
}

function clear_family_member_health_history_dialog() {
	$("#family_member_info_form_name").val("");
	$('#family_member_info_form_gender_male').prop('checked',false);
	$('#family_member_info_form_gender_female').prop('checked',false);
	$("#family_member_info_form_date_of_birth").val("");
	$("#family_member_info_form_twin_status_no").prop('checked',true);
	$("#family_member_info_form_twin_status_identical").prop('checked',false);
	$("#family_member_info_form_twin_status_fraternal").prop('checked',false);
	$("#family_member_info_form_adopted_no").prop('checked',false);
	
	$(".disease_detail").each(function () {
		$(this).remove();
	});
	
	$("#disease_choice_select").val($("#disease_choice_select").find('option').first().val());
	$("#detailed_disease_choice_select").val($("#detailed_disease_choice_select").find('option').first().val());
	$("#age_at_diagnosis_select").val($("#age_at_diagnosis_select").find('option').first().val());
	current_health_history = [];
	
	$("#family_race_ethnicity").find("#selectedRaces-1").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-2").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-3").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-4").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedRaces-5").prop('checked',false);
	
	$("#family_race_ethnicity").find("#selectedEthnicities-1").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-2").prop('checked',false);
	$("#family_race_ethnicity").find("#selectedEthnicities-3").prop('checked',false);
	
}

function clear_and_set_current_family_member_health_history_dialog(family_member) {
	$("#family_member_info_form_name").val(family_member.name);
	
	if (family_member.gender == "MALE") $('#family_member_info_form_gender_male').prop('checked',true);
	else $('#family_member_info_form_gender_male').prop('checked',false);
	
	if (family_member.gender == "FEMALE") $('#family_member_info_form_gender_female').prop('checked',true);
	else $('#family_member_info_form_gender_female').prop('checked',false);
	
	$("#family_member_info_form_date_of_birth").val(family_member.date_of_birth);
	
	if (family_member.twin_status == "NO") $("#family_member_info_form_twin_status_no").prop('checked',true);
	else if (family_member.twin_status == "IDENTICAL") $("#family_member_info_form_twin_status_identical").prop('checked',true);
	else if (family_member.twin_status == "FRATERNAL") $("#family_member_info_form_twin_status_fraternal").prop('checked',true);
	
	$("#family_member_info_form_adopted_no").prop('checked',family_member.adopted);

	// Age/Estimated Age or Cause of Death
	if (family_member.date_of_birth) {
		$("#is_person_alive").val('alive');
		$("#age_determination").val('date_of_birth');
		$('#age_determination_text').show().val(family_member.date_of_birth);
		$('#estimated_age_select').hide();
		$("#person_is_alive").show();
		$("#person_is_not_alive").hide();
	} else if (family_member.age) {
		$("#is_person_alive").val('alive');
		$("#age_determination_select").val('age');
		$('#age_determination_text').show().val(family_member.age);
		$('#estimated_age_select').hide();
		$("#person_is_alive").show();
		$("#person_is_not_alive").hide();
	} else if (family_member.estimated_age) {
		$("#is_person_alive").val('alive');
		$("#age_determination").val('estimated_age');
		$('#estimated_age_select').show().val(family_member.estimated_age);
		$('#age_determination_text').hide();
		$("#person_is_alive").show();
		$("#person_is_not_alive").hide();
	} else if (family_member.cause_of_death) {
		$("#is_person_alive").val('dead');
		$("#cause_of_death_select").val(family_member.cause_of_death);
		$("#cause_of_death_select").trigger("change");
		if (family_member.detailed_cause_of_death) {
			$("#detailed_cause_of_death_select").show().val(family_member.detailed_cause_of_death);
		}
		$('#estimated_death_age_select').val(family_member.estimated_death_age);
		$("#person_is_alive").hide();
		$("#person_is_not_alive").show();
	} else {
		$("#is_person_alive").val('unknown');
		$("#person_is_alive").hide();
		$("#person_is_not_alive").hide();
	}


	$(".disease_detail").each(function () {
		$(this).remove();
	});

	data_entry_row = $("#family_health_information").find("#health_data_entry_row");

	if (family_member['Health History'] != null) {
		current_health_history = family_member['Health History'];
		for (var i=0; i<current_health_history.length;i++) {		
			new_row = create_disease_row(
					current_health_history[i]['Disease Name'], 
					current_health_history[i]['Detailed Disease Name'], 
					current_health_history[i]['Age At Diagnosis']);
			data_entry_row.before(new_row);
		}		
	}

	
	$("#family_health_information").find("#disease_choice_select").val($("#disease_choice_select").find('option').first().val());
	$("#family_health_information").find("#detailed_disease_choice_select").val($("#detailed_disease_choice_select").find('option').first().val());
	$("#family_health_information").find("#age_at_diagnosis_select").val($("#age_at_diagnosis_select").find('option').first().val());
	
	if (family_member.race != null) {
		$("#family_race_ethnicity").find("#selectedRaces-1").prop('checked',family_member.race['American Indian or Alaska Native']);
		$("#family_race_ethnicity").find("#selectedRaces-2").prop('checked',family_member.race['Asian']);
		$("#family_race_ethnicity").find("#selectedRaces-3").prop('checked',family_member.race['Black or African-American']);
		$("#family_race_ethnicity").find("#selectedRaces-4").prop('checked',family_member.race['Native Hawaiian or Other Pacific Islander']);
		$("#family_race_ethnicity").find("#selectedRaces-5").prop('checked',family_member.race['White']);
	}
	
	if (family_member.ethnicity != null) {
		$("#family_race_ethnicity").find("#selectedEthnicities-1").prop('checked',family_member.ethnicity['Hispanic or Latino']);
		$("#family_race_ethnicity").find("#selectedEthnicities-2").prop('checked',family_member.ethnicity['Ashkenazi Jewish']);
		$("#family_race_ethnicity").find("#selectedEthnicities-3").prop('checked',family_member.ethnicity['Not Hispanic or Latino']);
	}
}

function clear_and_set_personal_health_history_dialog() {
//	$("#family_member_info_form_name").val(family_member.name);

	$("#personal_info_form_name").val(personal_information.name);
	
	if (personal_information.gender == "MALE") $('#personal_info_form_gender_male').prop('checked',true);
	else $('#personal_info_form_gender_male').prop('checked',false);
	
	if (personal_information.gender == "FEMALE") $('#personal_info_form_gender_female').prop('checked',true);
	else $('#personal_info_form_gender_female').prop('checked',false);
	
	$("#personal_info_form_date_of_birth").val(personal_information.date_of_birth);
	
	if (personal_information.twin_status == "NO") $("#personal_info_form_twin_status_no").prop('checked',true);
	else if (personal_information.twin_status == "IDENTICAL") $("#personal_info_form_twin_status_identical").prop('checked',true);
	else if (personal_information.twin_status == "FRATERNAL") $("#personal_info_form_twin_status_fraternal").prop('checked',true);
		
	$("#personal_info_form_adopted_no").prop('checked',personal_information.adopted);
	
	if (personal_information.height_unit == 'inches') {
		$("#personal_height_feet").val(Math.floor(personal_information.height/12) );
		$("#personal_height_inches").val(Math.floor(personal_information.height % 12) );
	} else if (personal_information.height_unit == 'centimeters') {
		$("#personal_height_centimeters").val(personal_information.height);
	}
	$("#personal_weight").val(personal_information.weight);
	$("#personal_weight_unit").val(personal_information.weight_unit);
	
	$(".disease_detail").each(function () {
		$(this).remove();
	});

	data_entry_row = $("#personal_health_information").find("#health_data_entry_row");

	if (personal_information['Health History'] != null) {
		current_health_history = personal_information['Health History'];
		for (var i=0; i<current_health_history.length;i++) {		
			new_row = create_disease_row(
					current_health_history[i]['Disease Name'], 
					current_health_history[i]['Detailed Disease Name'], 
					current_health_history[i]['Age At Diagnosis']);
			data_entry_row.before(new_row);
		}		
	}

	
	$("#personal_health_information").find("#disease_choice_select").val($("#disease_choice_select").find('option').first().val());
	$("#personal_health_information").find("#detailed_disease_choice_select").val($("#detailed_disease_choice_select").find('option').first().val());
	$("#personal_health_information").find("#age_at_diagnosis_select").val($("#age_at_diagnosis_select").find('option').first().val());

	$("#personal_race_ethnicity").find('#person.consanguinity').prop("checked", personal_information.consanguinity);

	if (personal_information.race != null) {
		$("#personal_race_ethnicity").find("#selectedRaces-1").prop('checked',personal_information.race['American Indian or Alaska Native']);
		$("#personal_race_ethnicity").find("#selectedRaces-2").prop('checked',personal_information.race['Asian']);
		$("#personal_race_ethnicity").find("#selectedRaces-3").prop('checked',personal_information.race['Black or African-American']);
		$("#personal_race_ethnicity").find("#selectedRaces-4").prop('checked',personal_information.race['Native Hawaiian or Other Pacific Islander']);
		$("#personal_race_ethnicity").find("#selectedRaces-5").prop('checked',personal_information.race['White']);
	}
	
	if (personal_information.ethnicity != null) {
		$("#personal_race_ethnicity").find("#selectedEthnicities-1").prop('checked',personal_information.ethnicity['Hispanic or Latino']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-2").prop('checked',personal_information.ethnicity['Ashkenazi Jewish']);
		$("#personal_race_ethnicity").find("#selectedEthnicities-3").prop('checked',personal_information.ethnicity['Not Hispanic or Latino']);
	}	
}
// Helper functions

function make_disease_array () {
	var keys = Object.keys(diseases);
	for (var i=0; i<keys.length;i++) {
		disease_list.push(keys[i]);
		for (var j=0; j<diseases[keys[i]].length; j++) {
			disease_list.push(diseases[keys[i]][j]);
		}
	}	
}

// Will get the querystring parameters for a url
function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}

