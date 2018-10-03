## Inspiration

I am taking my first environmental science course this semester and our first assignment requires us to measure our carbon footprint and derive a plan for reducing the environmental impact our lifestyles have. The site in which we calculate our carbon footprint also provides the number of Earths that would be needed to maintain everyone adopting our own lifestyle, which I think is powerful for environmental consciousness.

My initial idea was to implement a carbon footprint calculator as a skill, but I quickly realized that Alexa might not be the best platform for conducting a multiple part questionnaire with some questions that require information not on the top of one's head such as electrical usage or the number of miles driven per week. However, I still wanted to focus on carbon usage, which lead me to pick one aspect of carbon emission. I thought providing carbon emissions for food would be a very engaging way for people to be more environmentally conscious. In addition, by making this information easily accessible, it provides a way for people to make small choices and easily reduce their carbon footprint. For example, one can compare beef and chicken by asking "Alexa, ask food print to get the carbon emission for chicken and beef" and choose to change their diet to lean _slightly_ more towards chicken (beef is a difficult compromise).

## What it does

The skill provides the carbon emission for over 200 types of common food items. Simply ask for the foodprint of any food item. A food item can get as specific as its varieties such as a fuji apple. This way users can know what variety of have less of an impact to greenhouse gases than others. You can also ask for the foodprint of two items so that it is easier for users to compare different foods.

## How I built it

Built with Node.js and the ASK SDK v2 as a lambda function. The data comes from CleanMetrics with granted permission. 

## Challenges I ran into

The first challenge was finding data for carbon emissions for food. However, I stumbled on a food emissions calculator by CleanMetrics and got permission via email.

The main challenge that I ran into would be providing data to the user in an intuitive way. For example, how I would offer information about alternatives such as organic counterparts for fruits and filleted counterparts for fish while not overwhelming the user with too much data. In addition, US users should get data in imperial units while other should get data in the metric system. As a result, I had to consider how to organize the data so it would easy to retrieve for the users.

## Accomplishments that I'm proud of

Foremost, I'm proud of the idea, which made up most of the time I spent on this project. Otherwise, I am satisfied with how the skill responds to the user for different food items. The responses are natural and not overwhelming to the user. This way, it is easy for the user to quickly ask for a foodprint.

## What I learned

I've never really had to work with a lot of data before. I had to give consideration to how I wanted to organize the data into a JSON format. What I found to be an awesome tool is an online CSV to JSON converter. When getting the data online, I collected it in an excel making it easier to quickly copy the data. I fed it into an online converter and was able to make changes to keys and format the data how I wanted it to.

## What's next for FOODPRINT

This is really only a first draft of the skill. I hope to add a one or two more features such as providing alternatives food items for the user. I do want the skill to provide more information about carbon emissions in general as well such as the average carbon emission by city.
