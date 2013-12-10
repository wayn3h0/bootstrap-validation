#jQuery Validation Plugin for [Bootstrap](http://getbootstrap.com)

##Sample

###HTML

	<input type="password" 
	id="password" 
    name="password" 
    class="input-xlarge" 		
    placeholder="Password"
        
    data-validators="required pattern" 
    data-required-message="Please input your pasword!" 
    data-regex-pattern="^[\w]{6,18}$" 
    data-pattern-message="Password should be 6-18 characters">

	<input type="password" 
	id="passwordconfirm" 
	name="passwordconfirm" 
    class="input-xlarge" 
    placeholder="Confirm Password" 
        
    data-validators="required compare" 
    data-compare-target="password" 
    data-required-message="Please confirm your password!" 
    data-compare-message="Your password mismatched!">

### Javascript
	$('.form').validation()