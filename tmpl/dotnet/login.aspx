<%@ Page Language="C#" %>
<!doctype html>
<html lang="fr">
<head runat="server"> 
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, user-scalable=no;" /> 
	<meta name="format-detection" content="telephone=no" />
	<title>Zone sécurisée / Secured Zone</title> 
	<style> 
		html, body, form { height: auto; }
		h1 { font-size:18px; font-weight:bold; margin:5px 0; }
		h2 { color:#7c7c7c; font-size:13px; font-weight:bold; margin:0 0 5px 0; text-transform:uppercase; }
		body { background: #eaeaea; margin-top: 40px; color:#6c6c6c; font-family:arial,helvetica,sans-serif; font-size:11px; }
		p, pre, blockquote { margin:0 0 12px; }
		
		#Login { width: 500px; background: #fff; border: 1px solid #d9dfdd; margin: 0 auto; }
		#Login h2 { margin-top: 0; }
		#Login .Logo { float: left; width: 218px; border-right: 1px solid #d9dfdd; }
		#Login .Titre { float: left; width: 281px; height: 125px; }
		#Login .Titre td { padding: 18px; }
		#Login .Texte { clear: both; border-top: 1px solid #d9dfdd; padding: 18px; }
		#Login .Texte table { width:100%; }
		#Login .Texte table table { width:100%; }
		#Login .Texte table table tr td { padding:2px 10px; font-size:12px; }
		#Login .Texte table table tr td:first-child { width:38%;  }
		#Login .Texte table table tr:first-child td { padding-bottom:25px; color:#7c7c7c; font-size:13px; font-weight:bold; margin:0 0 5px 0; text-transform:uppercase; }

		#Login .Texte table table tr td span { padding:0 10px; font-size:16px; }
		#Login .Texte table table tr td label { color:#6c6c6c; font-size:11px; }
		#Login .Texte table table tr td input[type="checkbox"] { margin:0 5px 20px 42%; }
		#Login .Texte table table tr td input[type="submit"] { margin:20px 43% 0 0; }
	</style> 
	<script runat="server">
	   protected void Login1_Authenticate(object sender, AuthenticateEventArgs e) {
	       e.Authenticated = FormsAuthentication.Authenticate(Login1.UserName, Login1.Password);
	   }
	</script>
</head> 
<body> 
	<div id="Login">
		<div class="Logo">
			<img alt=""  width="218" height="125" src="data:image/gif;base64,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" />
		</div> 
		<table class="Titre" border="0" cellpadding="0" cellspacing="0"> 
			<tr> 
				<td><h1>Zone sécurisée<br />Secured Zone</h1></td> 
			</tr> 
		</table> 
		<div class="Texte"> 
		   <form id="form1" runat="server">
		       <asp:Login ID="Login1" runat="server" onauthenticate="Login1_Authenticate"></asp:Login>
		   </form>
		</div> 
	</div> 
</body> 
</html>