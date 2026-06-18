window.AXIOM_VISUAL_EVOLUTION = {
  hardware: {
    title: "From Label Printer to SmartScale",
    tagline: "A real product being built in public.",
    timelineStyle: "engineering",
    intro: [
      "The label printer project was the first serious attempt to simplify food tracking in the real world. What began as experiments with ESP32 boards, LCD displays, keypads, and thermal printers gradually evolved into a fully working device capable of printing food labels on demand.",
      "Along the way, dozens of ideas were tested, discarded, and refined. The project proved that identifying food could be made easier, but it also revealed a larger challenge: printing labels solved identification, yet weighing and logging food still required too many separate steps.",
      "Many of the lessons learned here ultimately led to the development of AxiomScale."
    ],
    milestoneTitles: [
      "Label Printing Experiments",
      "First Electronics Bring-Up",
      "Display Feedback",
      "Handheld Layout Testing",
      "Portable Form Study",
      "Physical Input Decisions",
      "Workshop Assembly",
      "Keypad Logic Testing",
      "Input Prototype",
      "Handheld Printer Trial",
      "Connector Refinement",
      "Internal Wiring",
      "Recycled Prototype",
      "Thermal Printer Integration",
      "First Printed Label",
      "Refined Printer Body",
      "Working Label Printer",
      "Tracking Food Preparation",
      "First Scale Prototype",
      "Measuring Weight Reliably",
      "The NFC Discovery",
      "Combining Identification and Weight",
      "Sensor Placement",
      "Mounting Refinement",
      "Control System Integration",
      "Load Distribution Tests",
      "Firmware Platform",
      "Full-Size Weighing Surface",
      "Pre-Integration Assembly",
      "Fully Wired Prototype",
      "First Complete Scale",
      "Building a Better Enclosure",
      "Improving Rigidity",
      "Internal Architecture",
      "Manufacturing Lessons",
      "Rapid Enclosure Iteration",
      "Real-World Weighing",
      "Accuracy Validation",
      "Towards a Consumer Product",
      "Current SmartScale Prototype"
    ],
    sections: [
      {
        title: "Label Printer Origins",
        text: "The first chapter explored whether a physical kitchen device could reduce the effort of identifying food.",
        images: [
          { src: "assets/evolution/galleries/Printer journey/HW-1.jpg", alt: "Early breadboard prototype with ESP32 development board, loose wiring and experimental electronics." },
          { src: "assets/evolution/galleries/Printer journey/HW-2.jpg", alt: "Initial ESP32 bring-up and firmware testing on development hardware." },
          { src: "assets/evolution/galleries/Printer journey/HW-3.jpg", alt: "First LCD display test showing successful communication with the controller." },
          { src: "assets/evolution/galleries/Printer journey/HW-4.jpg", alt: "Internal wiring mock-up inside an early handheld enclosure concept." },
          { src: "assets/evolution/galleries/Printer journey/HW-5.jpg", alt: "Early portable enclosure experiment with display and electronics integration." },
          { src: "assets/evolution/galleries/Printer journey/HW-6.jpg", alt: "Numeric keypad module selected for food identification input." },
          { src: "assets/evolution/galleries/Printer journey/HW-7.jpg", alt: "Prototype electronics mounted inside a temporary tray during development." },
          { src: "assets/evolution/galleries/Printer journey/HW-8.jpg", alt: "Breadboard testing of keypad input, LEDs and control logic." },
          { src: "assets/evolution/galleries/Printer journey/HW-9.jpg", alt: "Keypad prototype assembled from off-the-shelf components during concept validation." },
          { src: "assets/evolution/galleries/Printer journey/HW-10.jpg", alt: "Early handheld prototype combining keypad, display and enclosure." },
          { src: "assets/evolution/galleries/Printer journey/HW-11.jpg", alt: "Rear view of handheld prototype showing connector and enclosure design." },
          { src: "assets/evolution/galleries/Printer journey/HW-12.jpg", alt: "Internal wiring and component integration during hardware development." },
          { src: "assets/evolution/galleries/Printer journey/HW-13.jpg", alt: "Functional label printer prototype built using recycled and temporary materials." },
          { src: "assets/evolution/galleries/Printer journey/HW-14.jpg", alt: "Internal thermal printer mechanism integrated into the prototype enclosure." },
          { src: "assets/evolution/galleries/Printer journey/HW-15.jpg", alt: "First successful thermal label printing test from the custom device." },
          { src: "assets/evolution/galleries/Printer journey/HW-16.jpg", alt: "Refined enclosure with integrated controls and thermal printer." },
          { src: "assets/evolution/galleries/Printer journey/HW-17.jpg", alt: "Fully assembled label printer prototype capable of generating food labels." }
        ]
      },
      {
        type: "transition",
        title: "The problem changed",
        text: "The label printer proved that physical tools could reduce friction. But it also exposed a deeper problem. Identification was only one part of the process. The real challenge was making food logging happen naturally during cooking, without constantly reaching for a phone. That realisation marked the beginning of AxiomScale."
      },
      {
        title: "AxiomScale Evolution",
        tagline: "The moment the problem changed.",
        text: [
          "The label printer solved a real problem: identifying food quickly. But while building and testing it, a more important question emerged.",
          "People were not struggling to identify food. They were struggling to consistently log it.",
          "Every meal still required multiple steps. Find the food. Find the app. Search for the item. Enter the weight. Confirm the log.",
          "The focus shifted from printing labels to reducing friction.",
          "What followed was a long series of experiments involving load cells, NFC readers, custom electronics, 3D-printed enclosures, and entirely new interaction models. The goal was no longer to create a better label printer. The goal became creating a device that fit naturally into the act of weighing food itself.",
          "These photographs document that transition from rough proof-of-concept to the prototypes that would eventually become AxiomScale."
        ],
        images: [
          { src: "assets/evolution/galleries/Scale/SC-00.jpg", alt: "First AxiomScale proof-of-concept assembled from loose components during early experimentation." },
          { src: "assets/evolution/galleries/Scale/SC-01.jpg", alt: "Initial load-cell testing rig used to validate weighing hardware and sensor behaviour." },
          { src: "assets/evolution/galleries/Scale/SC-02.jpg", alt: "Early weight measurement experiment using exposed load-cell hardware." },
          { src: "assets/evolution/galleries/Scale/SC-03.jpg", alt: "First successful NFC reader integration test for food identification." },
          { src: "assets/evolution/galleries/Scale/SC-04.jpg", alt: "Prototype electronics combining weighing and NFC technologies on a development board." },
          { src: "assets/evolution/galleries/Scale/SC-05.jpg", alt: "Early enclosure mock-up exploring physical placement of sensors and electronics." },
          { src: "assets/evolution/galleries/Scale/SC-06.jpg", alt: "Refined sensor mounting prototype used during hardware development." },
          { src: "assets/evolution/galleries/Scale/SC-07.jpg", alt: "First consolidated electronics platform integrating core AxiomScale components." },
          { src: "assets/evolution/galleries/Scale/SC-08.jpg", alt: "Experimental weighing platform investigating load distribution and surface design." },
          { src: "assets/evolution/galleries/Scale/SC-09.jpg", alt: "ESP32 control system assembled for AxiomScale firmware development." },
          { src: "assets/evolution/galleries/Scale/SC-10.jpg", alt: "First full-size weighing surface prototype constructed for usability testing." },
          { src: "assets/evolution/galleries/Scale/SC-11.jpg", alt: "Early enclosure and weighing platform assembly prior to final integration." },
          { src: "assets/evolution/galleries/Scale/SC-12.jpg", alt: "Fully wired internal prototype combining load cells, NFC reader, display and controller." },
          { src: "assets/evolution/galleries/Scale/SC-13.jpg", alt: "First complete AxiomScale prototype capable of weighing and displaying measurements." },
          { src: "assets/evolution/galleries/Scale/SC-15.jpg", alt: "Redesigned enclosure bringing AxiomScale closer to a finished product form." },
          { src: "assets/evolution/galleries/Scale/SC-16.jpg", alt: "Internal mounting system developed to improve rigidity and measurement consistency." },
          { src: "assets/evolution/galleries/Scale/SC-17.jpg", alt: "Integrated AxiomScale prototype showing complete internal electronics layout." },
          { src: "assets/evolution/galleries/Scale/SC-18.jpg", alt: "Enclosure refinement focused on manufacturability and component access." },
          { src: "assets/evolution/galleries/Scale/SC-19.jpg", alt: "3D printing a revised AxiomScale enclosure during rapid iteration." },
          { src: "assets/evolution/galleries/Scale/SC-20.jpg", alt: "Functional AxiomScale prototype performing real-world weighing tests." },
          { src: "assets/evolution/galleries/Scale/SC-21.jpg", alt: "Accuracy validation test using a known weight on the AxiomScale platform." },
          { src: "assets/evolution/galleries/Scale/SC-22.jpg", alt: "Black-and-orange AxiomScale prototype featuring a more mature industrial design." },
          { src: "assets/evolution/galleries/Scale/SC-23.jpg", alt: "Advanced AxiomScale prototype with dedicated controls, display and NFC interaction area." }
        ]
      }
    ]
  },
  tokens: {
    title: "Token Evolution",
    tagline: "From \"one token per thing\" to a language designed around habits.",
    timelineStyle: "engineering",
    intro: [
      "The token system underwent almost as many revisions as the scale itself.",
      "The original assumption seemed obvious: if every ingredient had its own NFC token, identifying food would become effortless. In theory, more tokens meant less thinking, less searching, and less friction.",
      "In practice, every new token also added complexity.",
      "The challenge gradually shifted from creating more tokens to discovering which tokens actually mattered. Some represented ingredients. Others represented meals. Some eventually became passive shortcuts attached directly to jars, containers, and frequently used foods.",
      "Along the way the physical design evolved repeatedly. Shapes, colours, sizes, lettering, icons, and categorisation systems were all tested in search of something that could be recognised instantly while cooking.",
      "The result was not simply a collection of NFC tags. It became a visual language designed to reduce decision-making in the kitchen."
    ],
    milestoneTitles: [
      "Container Tag Experiment",
      "First Token Shapes",
      "Letter-Based Shortcuts",
      "Testing Form Factors",
      "Batch Prototype Run",
      "Category Language",
      "Visual Marker Trial",
      "Colour-Coded Groups",
      "Expanding the Token Family",
      "Moving From Letters to Icons",
      "Large Visual System Test",
      "Clearer Organisation",
      "Mature Token Ecosystem",
      "A Consistent Interaction Language"
    ],
    sections: [
      {
        title: "From markers to interaction language",
        text: "The token system moved from simple NFC markers toward physical shortcuts designed around habits and reduced friction.",
        images: [
          { src: "assets/evolution/galleries/tokens/TK-00.jpg", alt: "Early experiment attaching an NFC token to a food container to test identification workflows." },
          { src: "assets/evolution/galleries/tokens/TK-01.jpg", alt: "First physical token prototypes exploring shape, size and handling characteristics." },
          { src: "assets/evolution/galleries/tokens/TK-03.jpg", alt: "Early letter-based token system used to identify foods and categories." },
          { src: "assets/evolution/galleries/tokens/TK-04.jpg", alt: "Alternative token shapes and form factors evaluated during development." },
          { src: "assets/evolution/galleries/tokens/TK-05.jpg", alt: "Large batch of prototype tokens produced for usability and household testing." },
          { src: "assets/evolution/galleries/tokens/TK-06.jpg", alt: "Early category token concepts combining colour coding and symbolic markings." },
          { src: "assets/evolution/galleries/tokens/TK-07.jpg", alt: "Category token prototype featuring visual identification markers." },
          { src: "assets/evolution/galleries/tokens/TK-08.jpg", alt: "Introduction of colour-coded token groups for faster recognition." },
          { src: "assets/evolution/galleries/tokens/TK-09.jpg", alt: "Expanded token family exploring different categories and interaction models." },
          { src: "assets/evolution/galleries/tokens/TK-10.jpg", alt: "First icon-based token concepts replacing simple letters and symbols." },
          { src: "assets/evolution/galleries/tokens/TK-11.jpg", alt: "Large-scale visual language experiment testing icons, colours and grouping strategies." },
          { src: "assets/evolution/galleries/tokens/TK-12.jpg", alt: "Refined token organisation system with clearer visual hierarchy and categorisation." },
          { src: "assets/evolution/galleries/tokens/TK-13.jpg", alt: "Mature token ecosystem combining category tokens, ingredient tokens and visual symbols." },
          { src: "assets/evolution/galleries/tokens/TK-14.jpg", alt: "Advanced token set showing the evolution toward a consistent NFC interaction language." }
        ]
      },
      {
        type: "closing",
        title: "What the tokens taught the product",
        text: "One of the biggest surprises during development was discovering that the best token was often no token at all. Some foods benefited from dedicated identifiers, while others worked better as reusable categories or passive tags attached directly to containers. The token system evolved from a collection of NFC markers into a tool for reducing decisions during everyday cooking."
      }
    ]
  },
  icons: {
    title: "Icon Evolution",
    tagline: "Building a visual language for the kitchen.",
    timelineStyle: "engineering",
    intro: [
      "As the token system evolved, a new challenge emerged.",
      "Letters worked, but only up to a point. They required reading, interpretation, and often remembering what a particular token represented. In a kitchen environment, even small amounts of thinking create friction.",
      "The goal became creating a visual language that could be understood at a glance.",
      "Over time hundreds of icon concepts were created, refined, rejected, and redesigned. Different styles, colour systems, levels of detail, and categorisation approaches were tested. Some focused on ingredients. Others focused on food groups, actions, recipes, or system functions.",
      "The challenge was not simply making icons look attractive. The challenge was making them recognisable instantly while standing in a kitchen with wet hands, limited attention, and food waiting to be prepared.",
      "These images document the search for a visual language capable of replacing text wherever possible."
    ],
    milestoneTitles: [
      "First Category Icons",
      "Improving Consistency",
      "Reduced Colour Test",
      "Contrast and Visibility",
      "Ingredient-Specific Detail",
      "Actions and App Functions",
      "Hand-Drawn Language",
      "Fruit Recognition",
      "Dairy Recognition",
      "Protein Categories",
      "System Icon Set",
      "Printed Token Trial",
      "Full Icon Sheet",
      "Style Comparison",
      "Simplifying for Manufacture",
      "Vegetable Detail Set",
      "Advanced Ingredient Language"
    ],
    sections: [
      {
        title: "From letters to symbols",
        text: "The icon system documents the search for a shared visual language across tokens, categories, actions and kitchen workflows.",
        images: [
          { src: "assets/evolution/galleries/Icons/IC-1.png", alt: "First category icon concepts exploring simple representations for meat, dairy, grains, fruit and fish." },
          { src: "assets/evolution/galleries/Icons/IC-2.png", alt: "Early refinement of food category icons with improved visual consistency." },
          { src: "assets/evolution/galleries/Icons/IC-3.png", alt: "Reduced-colour icon experiment evaluating readability and recognition speed." },
          { src: "assets/evolution/galleries/Icons/IC-4.png", alt: "Light-background icon variation testing contrast and visibility." },
          { src: "assets/evolution/galleries/Icons/IC-5.png", alt: "Detailed fish and seafood icon concepts exploring ingredient-specific categories." },
          { src: "assets/evolution/galleries/Icons/IC-6.png", alt: "Expanded icon system introducing food groups, actions and application functions." },
          { src: "assets/evolution/galleries/Icons/IC-7.png", alt: "Hand-drawn ingredient icon sketches used to establish the initial visual language." },
          { src: "assets/evolution/galleries/Icons/IC-8.png", alt: "Fruit category icon development focusing on distinctive ingredient recognition." },
          { src: "assets/evolution/galleries/Icons/IC-9.png", alt: "Dairy product icon concepts covering milk, cheese, yoghurt and related foods." },
          { src: "assets/evolution/galleries/Icons/IC-10.png", alt: "Meat category icon set exploring recognisable representations of different protein sources." },
          { src: "assets/evolution/galleries/Icons/IC-11.png", alt: "Functional system icons designed for recipes, settings, logging and management tasks." },
          { src: "assets/evolution/galleries/Icons/IC-012.png", alt: "Physical token prototypes featuring printed ingredient icons for real-world evaluation." },
          { src: "assets/evolution/galleries/Icons/IC-12.png", alt: "Comprehensive icon sheet used to compare multiple category and style variations." },
          { src: "assets/evolution/galleries/Icons/IC-13.png", alt: "Side-by-side comparison of icon styles to determine the most effective visual approach." },
          { src: "assets/evolution/galleries/Icons/IC-14.png", alt: "Simplified outline icon concepts focused on rapid recognition and manufacturing suitability." },
          { src: "assets/evolution/galleries/Icons/IC-15.png", alt: "Ingredient-specific icon set for vegetables including onion, cucumber, tomato and potato." },
          { src: "assets/evolution/galleries/Icons/IC-16.png", alt: "Advanced livestock and meat icon system designed for direct food identification." }
        ]
      },
      {
        type: "closing",
        title: "What the icons taught the product",
        text: "One unexpected lesson was that creating an icon is easy. Creating an icon that can be recognised instantly, survives printing, works on a token, scales to an app, and remains understandable months later is considerably harder. The icon system continues to evolve, but each iteration moves closer to a common visual language shared across the entire ecosystem."
      }
    ]
  }
};

