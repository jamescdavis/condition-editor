# Condition Editor

The Condition Editor is deployed at https://jamescdavis.github.io/condition-editor/

## Inroduction

Welcome to my implementation of a Condition Editor UI. The goal of this app is to allow the user to filter a set of products by building a condition. The user first selects a property to filter on, then an operator (the list of which is dependent on the property type), followed by textual input for those operators that require it (or a select box for enumerated properties). Upon building a complete condition, the product list should refresh and be filtered by the user's condition. The deployed app uses [mirage.js](https://miragejs.com) to simulate an actual API (lag included), but is really just running completely in your browser.

## Technologies Used

For this application, I chose to implement using the brand new Octane edition of Ember.js. I implemented all application code using TypeScript via [ember-cli-typescript](https://ember-cli-typescript.com/) and avoided any use of `any` (aside from the `any` operator defined in this exercise). In additon, I used [mirage.js](https://miragejs.com/)/[ember-cli-mirage](https://www.ember-cli-mirage.com/), [ember-power-select](https://ember-power-select.com/), [ember-concurrency](http://ember-concurrency.com/), [ember-changeset](https://github.com/poteto/ember-changeset), and [ember-css-modules](https://github.com/salsify/ember-css-modules) and a number of other addons and development tools.

## Total Development Time

Approximately 15-20 hours

## Assumptions

I really only made one assumption, regarding UI behavior. It was unclear whether the user input should clear when changing properties and/or operators. In many cases it *has* to clear because it is invalid for the input type (e.g. random string for an enumerated property) so I implemented it to clear when either the property or operator changes.

## Development Process / Code Tour

Before I began writing any code, I spent some time thinking about the different types of data and how they related to each other and came up with a plan of attack. I decided to start on the models first, and build the app up from there.

### Setup

The first tasks were setup. I ran `ember new` to create a shiny new Ember application. I then immediately pinned `node` and `yarn` with `volta`. Following this I installed `ember-cli-typescript` and configured `eslint` for TypeScript, based on `airbnb-base`. I knew I'd be using `ember-cli-mirage` for development and testing (and, in this case, production!), so I went ahead and installed it.

To get the provided `datastore.js` loaded into the app, I placed it in `vendor/` and added an `app.import` to my [`ember-cli-build.js`](https://github.com/jamescdavis/condition-editor/blob/master/ember-cli-build.js) to add it to my vendor bundle. Since I was using TypeScript, I created [type declarations](https://github.com/jamescdavis/condition-editor/blob/master/types/condition-editor/index.d.ts) for `window.datastore`. This would allow me to access it in a type-safe way. At this point, I also converted the remaining `.js` files in `app/` from `ember new` to TypeScript so I'd have mostly pure TypeScript.

I wanted to have an easy way to run tests during development, so I configured a [GitHub Action workflow for CI](https://github.com/jamescdavis/condition-editor/blob/master/.github/workflows/ci.yml). It is triggered on evry push and [runs linters and tests](https://github.com/jamescdavis/condition-editor/actions).I finished out prerequisite setup by installing/adding various type declarations I'd need such as `jsonapi-typescript` and types for `ember-cli-mirage` as well as setting up an empty mirage config.

### Building Models

It was now time to start creating `ember-data` models. As I was using the most recent stable version of `ember-data` that uses separate package imports, I quickly remembered that the type definitions haven't quite caught up, so I created basic definitions for [`@ember-data/model`](https://github.com/jamescdavis/condition-editor/blob/master/types/%40ember-data/model.d.ts).

The first model I created was [`property`](https://github.com/jamescdavis/condition-editor/blob/master/app/models/property.ts). With no relationships of it's own, this would be the simplest of three models I had determined I needed. As I was now writing application code, I began to create a [basic unit test](https://github.com/jamescdavis/condition-editor/blob/master/tests/unit/models/property-test.ts). I find TypeScript `enum`s invaluable, so I created one to represent property types (`string`, `number`, `enumerated`). By creating a string-based `enum`, I would have a nice, type-safe, way to refer to property types without having to haul strings around.

Next I created the [`product`](https://github.com/jamescdavis/condition-editor/blob/master/app/models/product.ts) model. This model really just relates a set of `property-values` and contains no data on its own aside from the `id`. I stubbed out a [unit test](https://github.com/jamescdavis/condition-editor/blob/master/tests/unit/models/product-test.ts) for this model as well.

The final model I created was [`property-value`](https://github.com/jamescdavis/condition-editor/blob/master/app/models/property-value.ts). This model relates `product` and `property` and holds the product's value for the property. The [unit test](https://github.com/jamescdavis/condition-editor/blob/master/tests/unit/models/property-value-test.ts) I created for this model might be a bit superflous as it just checks that a `property-value` can hold a value.

The last type of thing that I'd need to represent is `operator`. As the set of operators are static, I chose to create a lib that exports an array of [`Operator`](https://github.com/jamescdavis/condition-editor/blob/master/app/lib/operator.ts) objects. Each `Operator` started out with just its id and a compare function. I defined the operator ids as an `enum` and also created a utility function for easily pulling an operator out of the list by id. The human-readable names of the operators live in `window.datastore`. To load them, I created an Ember [instance initializer](https://github.com/jamescdavis/condition-editor/blob/master/app/instance-initializers/load-operator-names.ts) that reads from `window.datastore.getOperators()` and loads the names into the operator lib in memory. I followed up by creating unit tests for both the [operator lib](https://github.com/jamescdavis/condition-editor/blob/master/tests/unit/lib/operator-test.ts) and the [instance intializer](https://github.com/jamescdavis/condition-editor/blob/master/tests/unit/instance-initializers/load-operator-names-test.ts). For the final part of this, I added a mapping of property types to operator to the [`property`](https://github.com/jamescdavis/condition-editor/blob/master/app/models/property.ts) model.

### Mirage

Now that I had created ways to represent data, I wanted to simulate an actual API rather than just loading director from the datastore. Mirage.js (formerly inseperable from `ember-cli-mirage`) was the answer. For development, I ceated a mirage [default scenario](https://github.com/jamescdavis/condition-editor/blob/master/mirage/scenarios/default.ts) that loads from the datastore and populates the mirage in-memory database. I knew I would want to do the same in an acceptance test later, so I put the code for this importable [utility functions](https://github.com/jamescdavis/condition-editor/blob/master/mirage/util.ts). This gets data *into* mirage, but to get it out, I needed to [configure endpoints](https://github.com/jamescdavis/condition-editor/blob/master/mirage/config.ts).

The `properties` endpoint required no special configuration as it is just for fetching the list of available properties. The `products` endpoint, however, was a bit more complex as it needed to handle filtering based on `property`, `operator`, and, for most operators, a `filter` input value. I decided these would be passed as query params when fetching products. In order to filter, I started with the full list of products in the mirage database and, for each, determined the `property-value` for the specified `property`. I then used the provided operator id to retrieve the specified operator and used its `compare` function to test the `property-value` against the provided `filter`. In order to safely cast the operator query param string to an operator id enum, I created a custom typeguard, `isOpId`. I now had a virtual "back end" on which to build the user interface.

### Controllers and Components

I planned to use `ember-concurrency` to handle async UI tasks, so I installed it along with `ember-concurrency-decorators` and a set of type declarations. As this is an Ember Octane app, I wanted to use `tracked` so I created a [stub type definition](https://github.com/jamescdavis/condition-editor/blob/master/types/%40glimmer/tracking.d.ts) for it. This app would only have a single route, so I just decided to use the application route. I created a [controller](https://github.com/jamescdavis/condition-editor/blob/master/app/controllers/application.ts) for the this route that uses an `ember-concurrency` task to load all the `properties` on `init`. I also created an accompanying [unit test](https://github.com/jamescdavis/condition-editor/blob/master/tests/unit/controllers/application-test.ts).

Now it was time to create some components. But first, I needed to install and config a few things. This included installing and/or configuring:
- `ember-cli-template-lint`
- `stylelint`
- `ember-css-modolues`
- `@ember/render-modifiers`

 I decided to start with the product table first and so created a [component](https://github.com/jamescdavis/condition-editor/tree/master/app/components/product-table) for it. I quickly realized that I needed to add a few more type declarations for `@ember-data/` and so created them. To be able to access a product's property values easily by property in the component template, I added a computed property to the [`product`](https://github.com/jamescdavis/condition-editor/blob/master/app/models/product.ts) model named `propValsByPropId` that remaps `product.propertyValues` into an object for easy access. The computed property's caching prevents this from needed to be recalculated every time its accessed. The `ProductTable` component takes `@property`, `@operator`, and `@filter` as arguments and passes these along when loading products. It uses the `did-insert` render modifier to kick off the first load and `did-update` watching both `@operator` and `@filter` because some operators don't require a filter. The result is then rendered as a styled html table. I also created the first [component integration test](https://github.com/jamescdavis/condition-editor/blob/master/tests/integration/components/product-table-test.ts) for this project.

The next component I tackled was the property chooser, which is the the first step in the condition editor. For this, I decided to use `ember-power-select`. This component is fairly simple. It takes a list of properties, the current property, and an action to perform when a property is chosen. It was so simple, in fact, that it could be a [template-only component](https://github.com/jamescdavis/condition-editor/blob/master/app/components/property-chooser.hbs). The [integration test](https://github.com/jamescdavis/condition-editor/blob/master/tests/integration/components/property-chooser-test.ts), too is fairly simple.

The [`OperatorChooser`](https://github.com/jamescdavis/condition-editor/tree/master/app/components/operator-chooser) was the next component I created. This component is very similar to `PropertyChooser` (it also uses `ember-power-select`), but it also needs to look up the valid operators for a given property type. It takes `@property` as an argument and uses a native getter called `opsForProp` to retrieve the operator list for that property, which it then passes to `PowerSelect`. This component also takes the current `@operator` and an `@onChange` action. Its [integration test](https://github.com/jamescdavis/condition-editor/blob/master/tests/integration/components/operator-chooser-test.ts) is a bit more complex, but not terribly so. 

The final piece of the puzzle is a component I've called `ConditionEditor`. [This component](https://github.com/jamescdavis/condition-editor/tree/master/app/components/condition-editor) brings together `PropertyChooser` and `OperatorChooser`, adds user input for the filter, and passes the built condition to `ProductTable`. It does this by invoking the choosers, passing the appropiate data and actions, conditionally invoking the correct kind of input based on property and operator, and then yielding `property`, `operator`, and `input`. This allows you invoke it as a block component and pass these values directly into the yielded block. This pattern is a little bit of a departure from Ember's traditional "data-down, actions up", but I find it useful in situations such as this where one component is essentially managing the state of another. A pure DDAU approach would pass in to `ConditionEditor` actions to modify `property`, `operator`, and `input` and these values would be stored on the parent that invokes both `ConditionEditor` and `ProductTable` (or passed down to a component that invokes one or both of them).

For user input, I like to use `ember-changeset` rather than modify the underlying property directly. This has a number of benefits. I've used it here as part of debouncing (the underlying property update that triggers product re-load is debounced). It is also useful for validation before updating, which I added later. The changeset is built on `did-insert` and `re-built` when `operator` changes (and `operator` is reset when `property` changes). To help determine the correct kind of input to render, I added some properties to operators and properties such as `operator.needsInput`, `property.isEnumerated`, and `operator.multi`. The `isEnumerated` property is calculated, so I added unit tests for it. The [integration test](https://github.com/jamescdavis/condition-editor/blob/master/tests/integration/components/condition-editor-test.ts) for `ConditionEditor` is quite extensive and originally contained a great deal of repetition. I created [test helpers](https://github.com/jamescdavis/condition-editor/blob/master/tests/helpers/select.ts) for selecting properties and operators, since it something I do a *lot* in that test and knew I would need for the acceptance test. I also created [some helpers](https://github.com/jamescdavis/condition-editor/blob/master/tests/helpers/input-type.ts) for testing what type of input was rendered.

### Putting it all Together

Finally, I was at the point of putting it all together this simply involved invoking `ConditionEditor` from the [application route template](https://github.com/jamescdavis/condition-editor/blob/master/app/templates/application.hbs) and giving it a block invoking `ProductTable` with its yielded values. At this point I had a fully functional app that met the requirements. I added an [acceptance test](https://github.com/jamescdavis/condition-editor/blob/master/tests/acceptance/application-test.ts) that uses the provided datastore via the mirage utilities I created earlier. I discovered this test ran quite slow due to havig to wait for debounced input, so I disabled debouncing in the test environment and the whole test suite now finishes in about 45 seconds.

 I decided, since I was already using `ember-changeset`, to add user input validation. I installed `ember-changeset-validations` for this and added some basic type declarations for it. I'm glad I added validation because it helped me discover a bug in comparing floats and integer values. I initially added validations for `string.in`, `number.equal`, `number.greater_than`, `number.less_than`, and `string.in`. I ultimately dropped the "non-in" validations in favor of using `type="number"` for the input, thus preventing invalid data entry on most modern browsers (and giving you a numpad on mobile!). I updated the `ConditionEditor` integration test and the acceptance test to test for invalid input.

### 🚢  Ship It! 🚢

I wanted to deploy to a live site, so I installed and configured `ember-cli-deploy` and `ember-cli-deploy-git` to easily build and publish to GitHub pages. I enabled mirage in production so I would have data on my live site. Now with a `ember deploy production` we're live!

### Make it Shiny

There's something about putting your work out there that makes you want go back and polish it more. I spent some time tweaking CSS and making it more mobile-friendly (totally usable, IMHO). Playing with my app also helped my to find some annoyances with validation (as much as I love RegExes, sometimes, they just *aren't* the answer). I ended up ripping out the `validateFormat` validators and replacing them with custom list validators that seem to work pretty well and are more true to what my fake back-end can acually handle. The final sign-off was to enable `noEmitOnError` in TypeScript's compiler settings to break the build on type errors (I mean, I had it on the whole time ;). If this were a real app being worked on by a team, I'd definitely keep this enabled from the outset.


----

# Running, Developing, Collaborating on this App

This section of the README outlines the details of collaborating on this Ember application.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/)
* [Yarn](https://yarnpkg.com/)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone git@github.com:jamescdavis/condition-editor.git`
* `cd condition-editor`
* `yarn install`

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `yarn lint:hbs`
* `yarn lint:js`
* `yarn lint:js --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

`ember deploy production`

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
