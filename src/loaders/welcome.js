exports.createWelcomePage = function() {
	document.getElementById("welcome-title").innerHTML = translate("welcome_title");

	let textCreate = document.getElementsByClassName("welcome-choose-text")[0];
	let textEdit = document.getElementsByClassName("welcome-choose-text")[1];
	textCreate.innerHTML = translate("welcome_create");
	textEdit.innerHTML = translate("welcome_edit");
	textCreate.innerHTML = textCreate.innerHTML.replace("{ICON}", "<span class=\"welcome-choose-text-color\">➕</span>")
	textEdit.innerHTML = textEdit.innerHTML.replace("{ICON}", "<span class=\"welcome-choose-text-color\">✒</span>")

	let smallTextCreate = document.getElementsByClassName("welcome-choose-text-small")[0];
	let smallTextEdit = document.getElementsByClassName("welcome-choose-text-small")[1];
	smallTextCreate.innerHTML = translate("welcome_create_small");
	smallTextEdit.innerHTML = translate("welcome_edit_small");
}
