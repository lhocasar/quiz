function autoLogOut(hora){
   if(hora){
       if (new Date().getTime() > hora + (1000 * 60 * 2)){
	return true;
       }
   }
   return false;
}

exports.finLogin = autoLogOut;
