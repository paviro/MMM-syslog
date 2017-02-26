# MMM-syslog
Notification API Module for MagicMirror<sup>2</sup>

## Example

![](https://forum.magicmirror.builders/uploads/files/1473753516823-syslog-icon-4.jpg)

## Dependencies
  * An installation of [MagicMirror<sup>2</sup>](https://github.com/MichMich/MagicMirror)

## Installation
 1. Clone this repo into `~/MagicMirror/modules` directory.
 2. Configure your `~/MagicMirror/config/config.js`:

    ```
    {
        module: 'MMM-syslog',
        position: 'top_right',
        config: {
            ...
        }
    }
    ```

## Config Options
| **Option** | **Default** | **Description** |
| --- | --- | --- |
| `max` | `5` | How many messages should be displayed on the screen. |
| `format` | `false` | Displays relative date format, for absolute date format provide a string like `'DD:MM HH:mm'` [All Options](http://momentjs.com/docs/#/displaying/format/) |
| `types` | `{INFO: "dimmed", WARNING: "normal", ERROR: "bright"}` | Object with message types and their css class. |
| `shortenMessage` | `false` | After how many characters the message should be cut. Default: show all. |
| `alert` | `true` | Display notification? |

## How to Use
Make an http get request like:
  http://MIRROR_IP:MIRROR_PORT/syslog?type=INFO&message=YOUR_MESSAGE
