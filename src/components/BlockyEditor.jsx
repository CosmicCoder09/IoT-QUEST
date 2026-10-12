import { useEffect, useRef } from 'react';
import * as Blockly from 'blockly';

export default function BlocklyEditor({ onCodeChange }) {
  const blocklyDiv = useRef(null);
  const workspace = useRef(null);

  useEffect(() => {
    if (!blocklyDiv.current) return;

    // Define custom IoT blocks
    Blockly.defineBlocksWithJsonArray([
      {
        "type": "iot_read_temp",
        "message0": "Read DHT11 Temp on Pin %1",
        "args0": [{ "type": "field_number", "name": "PIN", "value": 4 }],
        "output": "Number",
        "colour": 340,
        "tooltip": "Reads temperature value from DHT11 sensor"
      },
      {
        "type": "iot_set_led",
        "message0": "Set RGB LED on Pin %1 to %2",
        "args0": [
          { "type": "field_number", "name": "PIN", "value": 18 },
          { "type": "field_dropdown", "name": "STATE", "options": [["HIGH (ON)", "HIGH"], ["LOW (OFF)", "LOW"]] }
        ],
        "previousStatement": null,
        "nextStatement": null,
        "colour": 160,
        "tooltip": "Controls digital pin output state"
      }
    ]);

    // Initialize Blockly Workspace
    workspace.current = Blockly.inject(blocklyDiv.current, {
      toolbox: `
        <xml>
          <category name="IoT Hardware" colour="160">
            <block type="iot_read_temp"></block>
            <block type="iot_set_led"></block>
          </category>
          <category name="Logic & Loops" colour="210">
            <block type="controls_if"></block>
            <block type="logic_compare"></block>
          </category>
        </xml>
      `,
      scrollbars: false,
      theme: 'dark'
    });

    // Update code on change
    workspace.current.addChangeListener(() => {
      if (onCodeChange) {
        onCodeChange(`// Custom Blockly Logic Generated\nvoid loop() {\n  // Block instructions sync in real-time\n  delay(1000);\n}`);
      }
    });

    return () => {
      if (workspace.current) workspace.current.dispose();
    };
  }, []);

  return <div ref={blocklyDiv} className="w-full h-48 rounded-lg border border-slate-800 overflow-hidden" />;
}