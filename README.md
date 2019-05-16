# bamazon
Faux shopping backend with MySQL and Node.js

## bamazonCustomer.js
Queries the MySQL backend for a list of products and prices, and offers them to the user.  Upon product selection, it prompts for a quantity and queries the DB to ensure product availability.  If the order can be fulfilled, bamazonCustomer displays the total price to the user, then returns to the main product menu.
Choosing 'Exit' from the main product menu closes the DB connection and ends the program.

Video of the program in action:
https://drive.google.com/file/d/14HG3YpUZ7YdwdpBFXWCdT-QnDIhm0Ahp/view