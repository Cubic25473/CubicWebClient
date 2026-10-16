export type DocSection = { id: string; title: string; text: string[]; code?: string; language?: string };
export type DocPage = { slug: string; title: string; group: string; description: string; sections: DocSection[] };
export const cubicDocs: DocPage[] = [
 {slug:'overview',title:'Introduction',group:'Getting started',description:'CubicLib is an independent Java command framework for FTC, with odometry and a robot-hosted dashboard.',sections:[
  {id:'included',title:'What’s included',text:['Commands, subsystems, gamepad triggers and command groups help organize robot behavior. Localization supports goBILDA Pinpoint, two tracking wheels plus an IMU, or three tracking wheels.','The dashboard records TeleOp runs, displays position and heading on a nominal BIOBUZZ field, and offers replay, event markers and performance reports. Everything runs on the robot’s local network. CubicLib does not depend on Ivy or Pedro Pathing.']},
  {id:'requirements',title:'Requirements',text:['These docs describe the local CubicLib 0.2.0 preview, built against FTC SDK 12.0.0. Follow Installation to build the new API locally; public 0.1.0 does not include it. Use an Android Studio FTC Robot Controller project and a supported localization configuration.','The release has automated desktop tests and successful Android library builds. It still needs validation on your physical robot. Bézier paths are geometry utilities; this version does not include an autonomous motor controller or path follower.']},
  {id:'workflow',title:'Your first run',text:['Install the Maven dependency, deploy the Robot Controller app and connect to the robot network. Open Robot setup in the dashboard and enter your hardware configuration and starting pose.','Extend CubicOpMode or copy the complete TeleOp example. Initialize while the robot is stationary, verify localization, then Start. After Stop, replay or export the recording.']}
 ]},
 {
  "slug": "installation",
  "title": "Installation",
  "group": "Getting started",
  "description": "Build the 0.2.0 preview to use the simpler API and shared hardware map.",
  "sections": [
    {
      "id": "version",
      "title": "Choose the correct version",
      "text": [
        "These examples target CubicLib 0.2.0, currently a local development build. The public Maven release is still 0.1.0 and does not contain GlobalObjects or the new convenience methods. Do not use 0.1.0 with the examples on these pages."
      ]
    },
    {
      "id": "build",
      "title": "1. Build the local Maven repository",
      "text": [
        "In the updated CubicLib source checkout, use Android Studio’s JDK and Android SDK platform 34. Set JAVA_HOME and ANDROID_HOME (or sdk.dir in local.properties), then run:"
      ],
      "code": "./gradlew :cubic-core:test :cubic-ftc:assembleRelease publishAllPublicationsToDistributionRepository",
      "language": "Shell · CubicLib checkout"
    },
    {
      "id": "repository",
      "title": "2. Add the local repository",
      "text": [
        "In your FTC project’s existing repositories block, add the local Maven folder. This example assumes CubicLib is beside the FTC project; adjust the path if necessary. Keep google() and mavenCentral()."
      ],
      "code": "maven { url = uri(\"${rootDir}/../CubicLib/build/maven\") }",
      "language": "Groovy · root build.gradle"
    },
    {
      "id": "dependency",
      "title": "3. Add the dependency",
      "text": [
        "Add this to TeamCode/build.gradle and sync Gradle. CubicLib uses FTC SDK 12.0.0. Maven resolves cubic-core, Gson and NanoHTTPD alongside the Android library."
      ],
      "code": "dependencies {\n    implementation 'dev.cubiclib:cubic-ftc:0.2.0'\n}",
      "language": "Groovy · TeamCode/build.gradle"
    },
    {
      "id": "published",
      "title": "Public Maven hosting",
      "text": [
        "After 0.2.0 has been published, the local repository can be replaced with the public URL below. Until then, keep the local repository to resolve 0.2.0."
      ],
      "code": "maven { url = uri(\"https://cubic25473.github.io/CubicLib/maven/\") }",
      "language": "Groovy"
    },
    {
      "id": "deploy",
      "title": "4. Deploy and connect",
      "text": [
        "Build and deploy the Robot Controller app. Connect to the robot Wi-Fi and open http://<robot-ip>:8087/. A Control Hub commonly uses http://192.168.43.1:8087/; use the robot’s actual address.",
        "Open Robot setup to configure localization before Init. The dashboard starts via the FTC @OnCreate hook, with CubicOpMode.init() as a fallback. These public docs are separate from the dashboard hosted by your robot."
      ]
    }
  ]
},
 {slug:'robot-setup',title:'Robot setup',group:'Getting started',description:'Choose a localizer, configure the pods and set the initial field pose.',sections:[
  {id:'backend',title:'Choose a localization backend',text:['Open Robot setup on the robot dashboard before initializing an OpMode. Choose PINPOINT, TWO_WHEEL_IMU or THREE_WHEEL. Changing backend inserts example offsets: replace them with measurements from your robot.','Pinpoint uses two perpendicular pods and its internal IMU. Software two-wheel localization needs a configured REV Hub IMU. Three-wheel localization needs two parallel wheels and a perpendicular wheel with independent geometry.']},
  {id:'presets',title:'goBILDA and custom pods',text:['The goBILDA 4-Bar preset uses a 32 mm wheel and 2,000 decoded counts per revolution. The Swingarm preset uses a 48 mm wheel and 2,000 counts. Confirm the preset matches your hardware revision.','Custom pods need wheel diameter, decoded counts per encoder revolution and encoder revolutions per wheel revolution. Do not confuse vendor PPR with decoded counts. Software localizers allow a separate scale for each pod; this Pinpoint adapter requires matching scales.'],language:'Java · custom pod scale',code:'import dev.cubiclib.odometry.PodSpec;\n\nPodSpec custom = new PodSpec(35.0, 8192.0, 1.0);\ndouble mmPerCount = custom.mmPerCount();\n// π × diameter / (decoded counts × encoder revs per wheel rev)'},
  {id:'offsets',title:'Hardware names and mounting offsets',text:['For each wheel, set its hardware name, direction, xMm, yMm and angleRadians. Robot-relative x points forward and y points left. Angle 0 measures forward motion; π/2 measures leftward motion.','For Pinpoint, wheel 0 must be forward and wheel 1 left. Its x offset is the forward pod’s y position; its y offset is the left pod’s x position. Set pinpointName to the device name from the robot configuration.','For TWO_WHEEL_IMU, set imuName, imuLogoFacing and imuUsbFacing to match the actual Hub orientation. Encoder readings include SDK motor direction; keep dedicated encoder channel directions stable.']},
  {id:'start-pose',title:'Set the start pose',text:['Use Start pose X (mm), Y (mm) and Heading (degrees). The field origin is bottom-left in the dashboard: +X right, +Y up; 0° faces right and 90° faces up. The JSON representation uses radians.','Heading is robot orientation, not direction of travel. A mecanum robot can strafe with an unchanged heading. Save while stopped; the configuration is applied on the next Init. Pose fields and setup JSON remain synchronized.'],language:'Java · reset to a known pose inside CubicOpMode',code:'import dev.cubiclib.odometry.Pose2;\n\n// Only reset when you know the actual robot pose.\nresetPose(new Pose2(500, 600, Math.toRadians(90)));'},
  {id:'calibration',title:'Verify before recording',text:['Keep the robot stationary during Pinpoint IMU calibration. Push it a measured distance forward and left, then rotate it in place. Check scale, signs, heading and unwanted translation during rotation.','Set actual robot length, width and clearance. Keep field geometry confirmation off until the nominal map matches your practice-field assumptions. Never use default offsets as measured calibration.']}
 ]},
 {
  "slug": "first-teleop",
  "title": "Your first TeleOp",
  "group": "Getting started",
  "description": "Two small files: a subsystem that owns hardware and an OpMode that binds buttons.",
  "sections": [
    {
      "id": "subsystem",
      "title": "1. Create Intake.java",
      "text": [
        "Copy this into TeamCode. Match “intake” to your robot configuration. The shared hardware map is ready before configure() runs, so the subsystem does not need a HardwareMap constructor parameter.",
        "run(...) automatically requires this subsystem and calls stop() when the command ends or is interrupted."
      ],
      "code": "package org.firstinspires.ftc.teamcode;\n\nimport com.qualcomm.robotcore.hardware.DcMotor;\nimport dev.cubiclib.command.Command;\nimport dev.cubiclib.command.Subsystem;\nimport static dev.cubiclib.ftc.GlobalObjects.hardwareMapEverywhere;\n\n/** Construct inside configure(), after CubicLib makes the hardware map available. */\npublic final class Intake implements Subsystem {\n    private final DcMotor motor = hardwareMapEverywhere.get(DcMotor.class, \"intake\");\n    public Command collect() { return run(() -> motor.setPower(1)); }\n    @Override public void stop() { motor.setPower(0); }\n}\n",
      "language": "Java · Intake.java"
    },
    {
      "id": "minimal",
      "title": "2. Create SimpleTeleOp.java",
      "text": [
        "Configure odometry in the dashboard, then Init and Start. Hold A to run the intake; release to stop. Press B to run it for two seconds. Press X only when a pickup is confirmed.",
        "A and B commands share the intake requirement, so pressing one interrupts the other. A held binding does not restart after interruption until released and pressed again."
      ],
      "code": "package org.firstinspires.ftc.teamcode;\n\nimport com.qualcomm.robotcore.eventloop.opmode.TeleOp;\nimport dev.cubiclib.ftc.CubicOpMode;\n\n/** Copy with Intake.java into TeamCode; configure localization before Init. */\n@TeleOp(name = \"CubicLib Simple\")\npublic final class SimpleTeleOp extends CubicOpMode {\n    @Override protected void configure() {\n        Intake intake = register(new Intake());\n        whileHeld(() -> gamepad1.a, intake.collect());\n        onPress(() -> gamepad1.b, intake.collect().withTimeout(2));\n        onPressDo(() -> gamepad1.x, () -> mark(\"pickup-confirmed\"));\n    }\n}\n",
      "language": "Java · SimpleTeleOp.java"
    },
    {
      "id": "lifecycle",
      "title": "Lifecycle hooks",
      "text": [
        "configure() runs during Init. Construct and register subsystems here, never as OpMode field initializers or static singletons. onStarted(), onLoop() and onStopped() are optional. The base class owns the final FTC lifecycle methods.",
        "Each active loop updates localization, runs the scheduler, calls onLoop(), then samples telemetry. Stop cancels commands, stops subsystems, finalizes the log and clears the shared hardware map. Global hardware remains available during stop callbacks."
      ]
    },
    {
      "id": "driving-example",
      "title": "Complete mecanum example",
      "text": [
        "Download CubicTeleOp.java below for a four-motor drivetrain, a default drive action and event markers. Set the motor names and verify directions with wheels lifted. This example uses the same short syntax."
      ]
    }
  ]
},
 {
  "slug": "global-objects",
  "title": "Shared hardware map",
  "group": "Programming",
  "description": "Access the current HardwareMap from any subsystem without passing it through constructors.",
  "sections": [
    {
      "id": "access",
      "title": "GlobalObjects.hardwareMapEverywhere",
      "text": [
        "Import GlobalObjects and use the field directly, or use a static import for shorter code. CubicOpMode assigns the SDK HardwareMap before createLocalizer() and configure()."
      ],
      "code": "import dev.cubiclib.ftc.GlobalObjects;\n\nDcMotor motor = GlobalObjects.hardwareMapEverywhere\n    .get(DcMotor.class, \"intake\");",
      "language": "Java · inside a subsystem constructed in configure()"
    },
    {
      "id": "short-import",
      "title": "Use a static import",
      "text": [
        "This works in a standalone subsystem class, not just an inner class of the OpMode. Import DcMotor from com.qualcomm.robotcore.hardware."
      ],
      "code": "import static dev.cubiclib.ftc.GlobalObjects.hardwareMapEverywhere;\n\nprivate final DcMotor motor =\n    hardwareMapEverywhere.get(DcMotor.class, \"intake\");",
      "language": "Java · subsystem field"
    },
    {
      "id": "lifetime",
      "title": "Construct subsystems during configure()",
      "text": [
        "Create subsystems inside configure(), after the global map is set. Do not construct them in static initializers, static singletons, or OpMode field initializers. Recreate them for each OpMode; do not cache hardware between runs.",
        "The field is available through onStopped(), command end callbacks and subsystem stop(). It is reset to null after cleanup, including failed initialization and loop errors. Treat the public field as read-only; do not assign it yourself.",
        "Automatic binding requires CubicOpMode. An ordinary SDK OpMode does not populate it. For an ordinary OpMode, pass that OpMode’s hardwareMap into your subsystems explicitly. Global access does not make hardware thread-safe; use it on the OpMode thread."
      ]
    },
    {
      "id": "guard",
      "title": "Get a clear error outside the lifecycle",
      "text": [
        "requireHardwareMap() returns the same map, but throws a descriptive IllegalStateException if accessed before Init or after Stop. Direct field access outside its lifecycle returns null."
      ],
      "code": "DcMotor motor = GlobalObjects.requireHardwareMap()\n    .get(DcMotor.class, \"intake\");",
      "language": "Java"
    }
  ]
},
 {
  "slug": "commands",
  "title": "Commands & subsystems",
  "group": "Programming",
  "description": "Register a mechanism once, then bind its actions directly to gamepad buttons.",
  "sections": [
    {
      "id": "register",
      "title": "Register and bind",
      "text": [
        "Inside configure(), register(...) returns the subsystem so creation and registration fit on one line. onPress accepts a Command; onPressDo accepts a one-shot Runnable. whileHeld accepts a Command. Button conditions are lambdas so they are read each loop."
      ],
      "code": "Intake intake = register(new Intake());\nwhileHeld(() -> gamepad1.a, intake.collect());\nonPress(() -> gamepad1.b, intake.collect().withTimeout(2));\nonPressDo(() -> gamepad1.x, () -> mark(\"pickup-confirmed\"));",
      "language": "Java · inside configure()"
    },
    {
      "id": "actions",
      "title": "Write subsystem actions",
      "text": [
        "Implement Subsystem and override stop() to make the mechanism safe. run(action) repeats every scheduler loop and automatically calls your stop() on cancellation, timeout or interruption. once(action) runs once; it does not automatically undo the action. Both declare this subsystem as a requirement.",
        "For mechanisms, use subsystem actions rather than a bare onPressDo Runnable so conflicting commands cannot control the same hardware."
      ],
      "code": "public Command collect() {\n    return run(() -> motor.setPower(1));\n}\n\npublic Command reverseBriefly() {\n    return run(() -> motor.setPower(-1)).withTimeout(0.5);\n}\n\n@Override public void stop() { motor.setPower(0); }",
      "language": "Java · methods inside Intake"
    },
    {
      "id": "defaults",
      "title": "Set a default action",
      "text": [
        "A default runs when the subsystem is free and resumes after a conflicting command finishes. The Runnable overload automatically requires and stops the subsystem. For an existing Command, use scheduler.defaultCommand(subsystem, command)."
      ],
      "code": "defaultCommand(drive, () -> drive.mecanum(\n    -gamepad1.left_stick_y,\n    -gamepad1.left_stick_x,\n    -gamepad1.right_stick_x));",
      "language": "Java · inside configure()"
    },
    {
      "id": "compose",
      "title": "Chain and time actions",
      "text": [
        "withTimeout(seconds) interrupts the action at the time limit. then(next) runs the next action when the preceding command finishes normally; a timed command finishing its timeout also advances the sequence. Cancelling the entire sequence prevents later actions.",
        "Use schedule(command) in onStarted() to begin immediately at Start. Binding buttons during configure() does not start their actions until pressed. Scheduling an action directly in configure() may run its initialization during Init."
      ],
      "code": "// Inside onStarted(), with intake stored as an OpMode field:\nschedule(intake.collect().withTimeout(2)\n    .then(Commands.instant(() -> mark(\"intake-ended\"))));",
      "language": "Java · import dev.cubiclib.command.Commands"
    },
    {
      "id": "advanced",
      "title": "Advanced API remains available",
      "text": [
        "Existing scheduler, Trigger and Commands code still works. Commands.sequence, parallel, race and deadline compose multiple commands. Parallel groups reject overlapping subsystem requirements. Commands.functional provides custom initialize/execute/finish/end behavior.",
        "whileHeld uses rising-edge scheduling and cancels on release. It does not restart a command that finishes or is interrupted while the button stays down. Do not share a mutable command between an active group and an independent binding. All callbacks and hardware access belong on the OpMode thread."
      ]
    }
  ]
},
 {slug:'bezier-paths',title:'Bézier paths & heading',group:'Programming',description:'Describe curved motion while keeping mecanum heading independent of travel direction.',sections:[
  {id:'constant',title:'A curve with fixed heading',text:['Pass two control points for a line, three for a quadratic Bézier, or four for a cubic Bézier. Only their x/y coordinates define the curve; control-point headings are ignored.','This example moves along a quadratic curve while the robot keeps facing field +X, which represents strafing. Geometry does not send commands to motors.'],language:'Java · fixed-heading curve',code:'import dev.cubiclib.path.BezierPath;\nimport dev.cubiclib.odometry.Pose2;\n\nBezierPath curve = BezierPath.constantHeading(0,\n    new Pose2(400, 400, 0),\n    new Pose2(800, 1200, 0),\n    new Pose2(1600, 1200, 0));\n\nPose2 halfway = curve.at(0.5);\n// halfway.heading remains 0 radians.'},
  {id:'interpolation',title:'Interpolate robot heading',text:['Heading interpolation follows the shortest angular arc independently of the translation curve. From 170° to −170°, the robot rotates 20°, not 340°.'],language:'Java · cubic curve',code:'BezierPath turning = BezierPath.interpolateHeading(\n    Math.toRadians(170), Math.toRadians(-170),\n    new Pose2(400, 400, 0), new Pose2(800, 1200, 0),\n    new Pose2(1200, 1200, 0), new Pose2(1600, 400, 0));\n\nPose2 target = turning.at(0.5);\ndouble travelDirection = turning.tangentHeading(0.5);\ndouble lengthMm = turning.approximateLength(100);'},
  {id:'sampling',title:'Parameters, samples and limits',text:['at(t) accepts t from 0 to 1. t is a curve parameter, not elapsed time or normalized distance: equal t steps need not move equal distances. sample(100) returns 101 poses; approximateLength(100) estimates length from those samples.','tangentHeading(t) gives travel direction, not robot orientation, and throws when the tangent is stationary. Bézier geometry is not collision-checked by the Java class.','Dashboard route suggestions separately round corners only when recursive control-point bounds prove field clearance. CubicLib has no autonomous follower, velocity profile or automatic motor output for these curves.']}
 ]},
 {slug:'dashboard',title:'Dashboard & reports',group:'Tools',description:'Record, replay and inspect TeleOp motion on the robot’s local network.',sections:[
  {id:'live',title:'Connect to the robot',text:['Open http://<robot-ip>:8087/ while connected to the robot network. The robot serves all dashboard assets. It stays available between OpModes while the Robot Controller app is running.','Pose is sampled at up to 20 Hz and browser updates poll at 4 Hz. The robot footprint displays measured heading independently from its path. A disconnected browser does not stop recording.']},
  {id:'events',title:'Add useful events',text:['Inside CubicOpMode, mark actual mechanism events. Only pickup-confirmed followed by score-confirmed counts as a completed cycle. Command completion or a scoring attempt is not proof of success.'],language:'Java · event markers',code:'mark("intake-start");\n// When a sensor or driver confirms the pickup:\nmark("pickup-confirmed");\n// At the start of a scoring action:\nmark("score-attempt");\n// Only after confirmed successful scoring:\nmark("score-confirmed");'},
  {id:'reports',title:'Read the report',text:['Reports show distance, elapsed time, stationary time, confirmed cycles and review segments. Select a suggestion to highlight the corresponding interval; use the timeline to replay the measured pose.','A pause is not automatically wasted time. Route candidates compare matching cycle endpoints with static field geometry; they cannot know whether another robot, game piece or task requirement forced the actual route.','The BIOBUZZ map is a nominal schematic with conservative obstacle envelopes. Route comparison is disabled until the team confirms field geometry and robot dimensions in setup. Reset poses, invalid localization and data gaps break calculations.']},
  {id:'storage',title:'Export and retention',text:['Choose a saved session or Export session to download JSONL. Import JSONL replays it later without a robot. Incomplete logs can recover complete lines, but power loss may lose the last unflushed records.','The robot keeps the newest 20 sessions. Each session is limited to 15 minutes / 18,000 samples and 5,000 events. Export important logs before retention removes them. Clearing app data or uninstalling the app deletes robot recordings.']},
  {id:'demo',title:'Try it without a robot',text:['In a CubicLib source checkout, run the command below and open http://127.0.0.1:8087/. Click Load demo for a simulated Bézier run with strafing and independent heading. “Robot disconnected” is expected in this static preview. Hardware setup and live sessions require the robot.'],language:'Shell · CubicLib checkout',code:'python3 scripts/preview.py'}
 ]},
 {slug:'troubleshooting',title:'Troubleshooting',group:'Reference',description:'Common installation, localization and dashboard issues.',sections:[
  {id:'dependency',title:'Gradle cannot resolve CubicLib',text:['Check that the repository URL ends in /CubicLib/maven/ and the dependency is dev.cubiclib:cubic-ftc:0.2.0. This preview must be built locally; the hosted repository currently has 0.1.0 only. Add the local build/maven repository from Installation. Keep google() and mavenCentral(). Verify the project uses FTC SDK 12.0.0 and Gradle is not in offline mode.','After updating a repository configuration, sync again. Published release versions should not be overwritten; teams may still have the previous artifacts cached.']},
  {id:'network',title:'The dashboard does not open',text:['Connect to the robot’s network and check its actual IP. Use HTTP on port 8087. The team website and public docs are not the robot dashboard.','Confirm the Robot Controller app is running. Initializing a CubicOpMode installs the server as a fallback if automatic startup was unavailable. Check Robot Controller logs for a CubicLib startup error, such as a port conflict.']},
  {id:'localization',title:'Position or heading is wrong',text:['Verify starting field pose, encoder direction, decoded counts, wheel diameter, offsets and IMU mounting orientation. Pure rotation should not produce substantial translation.','Keep the Pinpoint stationary during calibration. A non-finite software-localizer IMU reading latches localization invalid until resetPose is called with a known pose. Unknown movement during sensor failure cannot be reconstructed.']},
  {id:'configuration',title:'Setup changes are rejected',text:['Stop the initialized or running CubicOpMode before saving. The new configuration is used on the next Init. Validate wheel count, unique hardware names and non-singular wheel geometry. Pinpoint requires matching pod scales and forward/left wheel orientation.']},
  {id:'suggestions',title:'No route suggestions',text:['Confirm field geometry and robot dimensions only after checking them. Record pickup-confirmed and score-confirmed events with valid, continuous pose data. Suggestions require meaningful distance reduction; not every cycle will produce one.']}
 ]}
];
