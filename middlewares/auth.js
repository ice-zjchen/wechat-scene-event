
function isWechatBrowser(userAgent) {
	var regx = (/micromessenger/i);
	var ua = userAgent.toLowerCase();

  return regx.test(ua);
}

function isLogin(argument) {
	// body...
}

