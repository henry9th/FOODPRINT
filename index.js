const Alexa = require('ask-sdk-core');
const food_carbons = require('./food_carbon');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const item = requestAttributes.t(getRandomItem(Object.keys(food_carbons.FOOD_EN_US)));

    const speakOutput = requestAttributes.t('WELCOME_MESSAGE', requestAttributes.t('SKILL_NAME'), item);
    const repromptOutput = requestAttributes.t('WELCOME_REPROMPT');

    handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(repromptOutput)
      .getResponse();
  },
};

const FoodCarbonHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' && handlerInput.requestEnvelope.request.intent.name === 'GetFoodCarbonIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const itemSlot = handlerInput.requestEnvelope.request.intent.slots.food_item;
    const itemSlot2 = handlerInput.requestEnvelope.request.intent.slots.compare_item;

    let itemName;
    let itemName2;
    let matchObjects;
    let matchObjects2;
    if (itemSlot && itemSlot.value) {
      itemName = itemSlot.value.toLowerCase();
      matchObjects = itemSlot.resolutions.resolutionsPerAuthority[0].values;
    }
    if (itemSlot2 && itemSlot2.value) {
      itemName2 = itemSlot.value.toLowerCase();
      matchObjects2 = itemSlot2.resolutions.resolutionsPerAuthority[0].values;
    }
    if ((typeof matchObjects == 'undefined' || matchObjects.length == 0) || (typeof itemSlot2.value != 'undefined' && (typeof matchObjects2 == 'undefined' || matchObjects2.length == 0))) { // no matching values
      console.log("DID IT CATCH?");
      var speakOutput = requestAttributes.t('FOOD_NOT_FOUND_MESSAGE');
      const repromptSpeech = requestAttributes.t('FOOD_NOT_FOUND_REPROMPT');
      var problemName;
      if (matchObjects == 'undefined' || matchObjects.length == 0) { problemName = itemName } else { problemName = itemName2 }
      if (itemName) {
        speakOutput += requestAttributes.t('FOOD_NOT_FOUND_WITH_ITEM_NAME', itemName);
      } else {
        speakOutput += requestAttributes.t('FOOD_NOT_FOUND_WITHOUT_ITEM_NAME');
      }
      speakOutput += repromptSpeech;

      sessionAttributes.speakOutput = speakOutput; //saving speakOutput to attributes, so we can use it to repeat
      sessionAttributes.repromptSpeech = repromptSpeech;

      handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
      console.log("Before return");
      return handlerInput.responseBuilder
        .speak(sessionAttributes.speakOutput)
        .reprompt(sessionAttributes.repromptSpeech)
        .getResponse();
    } else {
        var foodCarbonText = "";
        let matchKeys = new Array(matchObjects.length);
        var speakOutput = "";
        for (var i = 0; i < matchObjects.length; i++) {
            var key = (matchObjects[i].value.name);

            var myFoods;
            if (handlerInput.requestEnvelope.request.locale === 'en-US') {
              myFoods = food_carbons.FOOD_EN_US;
            } else {
              myFoods = food_carbons.FOOD_EN_GB;
            }
            var info = myFoods[key];

            if (i == 0) {
              speakOutput += requestAttributes.t("CARBON_FOOTPRINT", key, info.p_emissions);
            } else {
              speakOutput += requestAttributes.t("CARBON_FOOTPRINT_SHORT", key, info.p_emissions);
            }
            foodCarbonText += (key + ": " + info.p_emissions + "\n");
            if (info.alt != null) {
              if (info.category === 'fruit' || info.category === 'vegetable') {
                speakOutput += requestAttributes.t("ALT_CARBON_FOOTPRINT", "Organic", key, info.alt);
                foodCarbonText += ("organic " + key + ": " + info.p_emissions + "\n");
              }
              if (info.category === 'fish') {
                speakOutput += requestAttributes.t("ALT_CARBON_FOOTPRINT", "Filleted", key, info.alt);
                foodCarbonText += ("filleted " + key + ": " + info.p_emissions + "\n");
              }
            }
        }

        if (matchObjects2) {
          for (var i = 0; i < matchObjects2.length; i++) {
              var key = (matchObjects2[i].value.name);
              var info = myFoods[key];
              if (i == 0) {
                  speakOutput += requestAttributes.t("COMPARE_CARBON_FOOTPRINT", key, info.p_emissions);
              } else {
                speakOutput += requestAttributes.t("CARBON_FOOTPRINT_SHORT", key, info.p_emissions);
              }
              foodCarbonText += (key + ": " + info.p_emissions + "\n");
              if (info.alt != null) {
                if (info.category === 'fruit' || info.category === 'vegetable') {
                  speakOutput += requestAttributes.t("ALT_CARBON_FOOTPRINT", "Organic", key, info.alt);
                  foodCarbonText += ("organic " + key + ": " + info.p_emissions + "\n");
                }
                if (info.category === 'fish') {
                  speakOutput += requestAttributes.t("ALT_CARBON_FOOTPRINT", "Filleted", key, info.alt);
                  foodCarbonText += ("filleted " + key + ": " + info.p_emissions + "\n");
                }
              }
          }
        }

        const repromptOutput = requestAttributes.t('WELCOME_REPROMPT');

        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);

        const cardTitle = requestAttributes.t('DISPLAY_CARD_TITLE', requestAttributes.t('SKILL_NAME'));

        return handlerInput.responseBuilder
          .speak(speakOutput)
          .withSimpleCard(cardTitle, foodCarbonText)
          .getResponse();
      }
  },

};

const HelpHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();

    const item = requestAttributes.t(getRandomItem(Object.keys(food_carbons.FOOD_EN_US)));

    sessionAttributes.speakOutput = requestAttributes.t('HELP_MESSAGE', item);
    sessionAttributes.repromptSpeech = requestAttributes.t('HELP_REPROMPT', item);

    return handlerInput.responseBuilder
      .speak(sessionAttributes.speakOutput)
      .reprompt(sessionAttributes.repromptSpeech)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent');
  },
  handle(handlerInput) {
    const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
    const speakOutput = requestAttributes.t('STOP_MESSAGE', requestAttributes.t('SKILL_NAME'));

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },

};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};


const skillBuilder = Alexa.SkillBuilders.custom();
const languageStrings = {
  en: {
    translation: {
      SKILL_NAME: "FOODPRINT",
      WELCOME_MESSAGE: 'Welcome to %s. You can ask a question like, what\'s the carbon footprint for %s? ... Now, what can I help you with?',
      WELCOME_REPROMPT: 'For instructions on what you can say, please say help me.',
      DISPLAY_CARD_TITLE: '%s',
      HELP_MESSAGE: 'You can ask questions such as, what\'s the carbon footprint for %s, or, you can say exit...Now, what can I help you with?',
      HELP_REPROMPT: 'You can say things like, what\'s the carbon footprint for %s, or you can say exit...Now, what can I help you with?',
      STOP_MESSAGE: 'Goodbye!',
      FOOD_NOT_FOUND_MESSAGE: 'I\'m sorry, I currently do not know ',
      FOOD_NOT_FOUND_WITH_ITEM_NAME: 'the carbon footprint for %s. ',
      FOOD_NOT_FOUND_WITHOUT_ITEM_NAME: 'that food. ',
      FOOD_NOT_FOUND_REPROMPT: 'What else can I help with?',
      CARBON_FOOTPRINT: 'A pound of %s emits %s pounds of carbon dioxide. ',
      CARBON_FOOTPRINT_SHORT: '%s %s. ',
      ALT_CARBON_FOOTPRINT: '%s %s emits %s pounds. ',
      COMPARE_CARBON_FOOTPRINT: 'On the other hand, %s emits %s pounds. '
      }
    },
    'en-US': {
    translation: {
      SKILL_NAME: 'FOODPRINT',
      DISPLAY_CARD_TITLE: '%s (lb)',
      CARBON_FOOTPRINT: 'A pound of %s emits %s pounds of carbon dioxide. ',
      CARBON_FOOTPRINT_SHORT: '%s %s. ',
      ALT_CARBON_FOOTPRINT: '%s %s emits %s pounds. ',
      COMPARE_CARBON_FOOTPRINT: 'On the other hand, %s emits %s pounds. '
    },
  },
    'en-GB': {
    translation: {
      SKILL_NAME: 'FOODPRINT',
      DISPLAY_CARD_TITLE: '%s (kg)',
      CARBON_FOOTPRINT: 'A kilogram of %s emits %s kilograms of carbon dioxide. ',
      CARBON_FOOTPRINT_SHORT: '%s %s. ',
      ALT_CARBON_FOOTPRINT: '%s %s emits %s kilograms. ',
      COMPARE_CARBON_FOOTPRINT: 'On the other hand, %s emits %s kilograms. '
    },
  },

};

// Finding the locale of the user
const LocalizationInterceptor = {
  process(handlerInput) {
    const localizationClient = i18n.use(sprintf).init({
      lng: handlerInput.requestEnvelope.request.locale,
      overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
      resources: languageStrings,
      returnObjects: true
    });

    const attributes = handlerInput.attributesManager.getRequestAttributes();
    attributes.t = function (...args) {
      return localizationClient.t(...args);
    };
  },
};

function getRandomItem(arrayOfItems) {
  // the argument is an array [] of words or phrases
  let i = 0;
  i = Math.floor(Math.random() * arrayOfItems.length);
  return (arrayOfItems[i]);
};

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    FoodCarbonHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addRequestInterceptors(LocalizationInterceptor)
  .addErrorHandlers(ErrorHandler)
  .lambda();
