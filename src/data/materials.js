// Material Master Database
// All materials used in swimming pool plumbing work

export const categories = [
  { id: 'pumps', name: 'Pumps & Equipment', nameKannada: 'ಪಂಪ್‌ಗಳು ಮತ್ತು ಉಪಕರಣಗಳು', icon: '⚙️' },
  { id: 'pipes', name: 'Pipes', nameKannada: 'ಪೈಪ್‌ಗಳು', icon: '🔧' },
  { id: 'fittings', name: 'Fittings', nameKannada: 'ಫಿಟ್ಟಿಂಗ್‌ಗಳು', icon: '🔩' },
  { id: 'valves', name: 'Valves & NRV', nameKannada: 'ವಾಲ್ವ್‌ಗಳು', icon: '🚰' },
  { id: 'drains', name: 'Drains, Inlets, Nozzles', nameKannada: 'ಡ್ರೈನ್, ಇನ್‌ಲೆಟ್, ನಾಜಲ್', icon: '💧' },
  { id: 'lights', name: 'Lights & Electrical', nameKannada: 'ಲೈಟ್ ಮತ್ತು ಎಲೆಕ್ಟ್ರಿಕಲ್', icon: '💡' },
  { id: 'chemicals', name: 'Chemicals & Solvents', nameKannada: 'ಕೆಮಿಕಲ್ ಮತ್ತು ಸಾಲ್ವೆಂಟ್', icon: '🧪' },
  { id: 'fasteners', name: 'Fasteners & Supports', nameKannada: 'ಫಾಸ್ಟ್‌ನರ್ ಮತ್ತು ಸಪೋರ್ಟ್', icon: '🔨' },
  { id: 'accessories', name: 'Accessories & Tools', nameKannada: 'ಉಪಕರಣಗಳು', icon: '🛠️' },
];

// Unit options for different material types
export const unitOptions = {
  pipes: ['Length', 'Feet', 'Meter'],
  cables: ['Meter', 'Feet'],
  solvents: ['ml', 'Liter', 'Nos'],
  sand: ['Kg', 'Bag'],
  nails: ['Nos', 'Kg'],
  default: null, // No toggle, use default unit
};

export const materials = [
  // ========== PUMPS & EQUIPMENT ==========
  { id: 'filter_pump_1hp', category: 'pumps', name: 'Filter Pump 1HP', nameKannada: 'ಫಿಲ್ಟರ್ ಪಂಪ್ 1HP', size: '1 HP', unit: 'Nos', unitType: 'default' },
  { id: 'filter_pump_1.5hp', category: 'pumps', name: 'Filter Pump 1.5HP', nameKannada: 'ಫಿಲ್ಟರ್ ಪಂಪ್ 1.5HP', size: '1.5 HP', unit: 'Nos', unitType: 'default' },
  { id: 'filter_pump_2hp', category: 'pumps', name: 'Filter Pump 2HP', nameKannada: 'ಫಿಲ್ಟರ್ ಪಂಪ್ 2HP', size: '2 HP', unit: 'Nos', unitType: 'default' },
  { id: 'filter_pump_3hp', category: 'pumps', name: 'Filter Pump 3HP', nameKannada: 'ಫಿಲ್ಟರ್ ಪಂಪ್ 3HP', size: '3 HP', unit: 'Nos', unitType: 'default' },
  { id: 'air_blower', category: 'pumps', name: 'Air Blower', nameKannada: 'ಏರ್ ಬ್ಲೋವರ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'jacuzzi_pump', category: 'pumps', name: 'Jacuzzi Pump', nameKannada: 'ಜಕೂಜಿ ಪಂಪ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'submersible_pump', category: 'pumps', name: 'Submersible Pump', nameKannada: 'ಸಬ್‌ಮರ್ಸಿಬಲ್ ಪಂಪ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'filter_sand', category: 'pumps', name: 'Filter Sand', nameKannada: 'ಫಿಲ್ಟರ್ ಮರಳು', size: '', unit: 'Kg', unitType: 'sand' },
  { id: 'bio_balls', category: 'pumps', name: 'Bio Balls', nameKannada: 'ಬಯೋ ಬಾಲ್ಸ್', size: '', unit: 'Kg', unitType: 'default' },
  { id: 'uv_system', category: 'pumps', name: 'UV System', nameKannada: 'UV ಸಿಸ್ಟಮ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'sand_filter', category: 'pumps', name: 'Sand Filter', nameKannada: 'ಸ್ಯಾಂಡ್ ಫಿಲ್ಟರ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'multiport_valve', category: 'pumps', name: 'Multiport Valve', nameKannada: 'ಮಲ್ಟಿಪೋರ್ಟ್ ವಾಲ್ವ್', size: '', unit: 'Nos', unitType: 'default' },

  // ========== PIPES ========== (all have unit toggle)
  { id: 'pipe_20mm', category: 'pipes', name: '20mm PVC Pipe', nameKannada: '20mm ಪೈಪ್', size: '20mm', unit: 'Length', unitType: 'pipes' },
  { id: 'pipe_25mm', category: 'pipes', name: '25mm PVC Pipe', nameKannada: '25mm ಪೈಪ್', size: '25mm', unit: 'Length', unitType: 'pipes' },
  { id: 'pipe_32mm', category: 'pipes', name: '32mm PVC Pipe', nameKannada: '32mm ಪೈಪ್', size: '32mm', unit: 'Length', unitType: 'pipes' },
  { id: 'pipe_40mm', category: 'pipes', name: '40mm PVC Pipe', nameKannada: '40mm ಪೈಪ್', size: '40mm', unit: 'Length', unitType: 'pipes' },
  { id: 'pipe_50mm', category: 'pipes', name: '50mm PVC Pipe', nameKannada: '50mm ಪೈಪ್', size: '50mm', unit: 'Length', unitType: 'pipes' },
  { id: 'pipe_63mm', category: 'pipes', name: '63mm PVC Pipe', nameKannada: '63mm ಪೈಪ್', size: '63mm', unit: 'Length', unitType: 'pipes' },
  { id: 'pipe_75mm', category: 'pipes', name: '75mm PVC Pipe', nameKannada: '75mm ಪೈಪ್', size: '75mm', unit: 'Length', unitType: 'pipes' },
  { id: 'pipe_90mm', category: 'pipes', name: '90mm PVC Pipe', nameKannada: '90mm ಪೈಪ್', size: '90mm', unit: 'Length', unitType: 'pipes' },
  { id: 'pipe_110mm', category: 'pipes', name: '110mm PVC Pipe', nameKannada: '110mm ಪೈಪ್', size: '110mm', unit: 'Length', unitType: 'pipes' },
  // UPVC Pipes
  { id: 'upvc_1.5inch', category: 'pipes', name: '1.5" UPVC Pipe', nameKannada: '1.5" UPVC ಪೈಪ್', size: '1.5"', unit: 'Length', unitType: 'pipes' },
  { id: 'upvc_2inch', category: 'pipes', name: '2" UPVC Pipe', nameKannada: '2" UPVC ಪೈಪ್', size: '2"', unit: 'Length', unitType: 'pipes' },
  { id: 'upvc_2.5inch', category: 'pipes', name: '2.5" UPVC Pipe', nameKannada: '2.5" UPVC ಪೈಪ್', size: '2.5"', unit: 'Length', unitType: 'pipes' },
  { id: 'upvc_3inch', category: 'pipes', name: '3" UPVC Pipe', nameKannada: '3" UPVC ಪೈಪ್', size: '3"', unit: 'Length', unitType: 'pipes' },
  { id: 'upvc_4inch', category: 'pipes', name: '4" UPVC Pipe', nameKannada: '4" UPVC ಪೈಪ್', size: '4"', unit: 'Length', unitType: 'pipes' },
  { id: 'upvc_6inch', category: 'pipes', name: '6" UPVC Pipe', nameKannada: '6" UPVC ಪೈಪ್', size: '6"', unit: 'Length', unitType: 'pipes' },
  // Flexible Pipe
  { id: 'flex_pipe_1.5inch', category: 'pipes', name: '1.5" Flexible Pipe', nameKannada: '1.5" ಫ್ಲೆಕ್ಸಿಬಲ್ ಪೈಪ್', size: '1.5"', unit: 'Meter', unitType: 'pipes' },
  { id: 'flex_pipe_2inch', category: 'pipes', name: '2" Flexible Pipe', nameKannada: '2" ಫ್ಲೆಕ್ಸಿಬಲ್ ಪೈಪ್', size: '2"', unit: 'Meter', unitType: 'pipes' },

  // ========== FITTINGS ==========
  // Elbows
  { id: 'elbow_20mm', category: 'fittings', name: '20mm Elbow', nameKannada: '20mm ಎಲ್ಬೋ', size: '20mm', unit: 'Nos', unitType: 'default' },
  { id: 'elbow_25mm', category: 'fittings', name: '25mm Elbow', nameKannada: '25mm ಎಲ್ಬೋ', size: '25mm', unit: 'Nos', unitType: 'default' },
  { id: 'elbow_32mm', category: 'fittings', name: '32mm Elbow', nameKannada: '32mm ಎಲ್ಬೋ', size: '32mm', unit: 'Nos', unitType: 'default' },
  { id: 'elbow_40mm', category: 'fittings', name: '40mm Elbow', nameKannada: '40mm ಎಲ್ಬೋ', size: '40mm', unit: 'Nos', unitType: 'default' },
  { id: 'elbow_50mm', category: 'fittings', name: '50mm Elbow', nameKannada: '50mm ಎಲ್ಬೋ', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'elbow_63mm', category: 'fittings', name: '63mm Elbow', nameKannada: '63mm ಎಲ್ಬೋ', size: '63mm', unit: 'Nos', unitType: 'default' },
  { id: 'elbow_75mm', category: 'fittings', name: '75mm Elbow', nameKannada: '75mm ಎಲ್ಬೋ', size: '75mm', unit: 'Nos', unitType: 'default' },
  { id: 'elbow_90mm', category: 'fittings', name: '90mm Elbow', nameKannada: '90mm ಎಲ್ಬೋ', size: '90mm', unit: 'Nos', unitType: 'default' },
  { id: 'elbow_110mm', category: 'fittings', name: '110mm Elbow', nameKannada: '110mm ಎಲ್ಬೋ', size: '110mm', unit: 'Nos', unitType: 'default' },
  // Tees
  { id: 'tee_20mm', category: 'fittings', name: '20mm T', nameKannada: '20mm ಟೀ', size: '20mm', unit: 'Nos', unitType: 'default' },
  { id: 'tee_25mm', category: 'fittings', name: '25mm T', nameKannada: '25mm ಟೀ', size: '25mm', unit: 'Nos', unitType: 'default' },
  { id: 'tee_32mm', category: 'fittings', name: '32mm T', nameKannada: '32mm ಟೀ', size: '32mm', unit: 'Nos', unitType: 'default' },
  { id: 'tee_40mm', category: 'fittings', name: '40mm T', nameKannada: '40mm ಟೀ', size: '40mm', unit: 'Nos', unitType: 'default' },
  { id: 'tee_50mm', category: 'fittings', name: '50mm T', nameKannada: '50mm ಟೀ', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'tee_63mm', category: 'fittings', name: '63mm T', nameKannada: '63mm ಟೀ', size: '63mm', unit: 'Nos', unitType: 'default' },
  { id: 'tee_75mm', category: 'fittings', name: '75mm T', nameKannada: '75mm ಟೀ', size: '75mm', unit: 'Nos', unitType: 'default' },
  { id: 'tee_90mm', category: 'fittings', name: '90mm T', nameKannada: '90mm ಟೀ', size: '90mm', unit: 'Nos', unitType: 'default' },
  // End Caps
  { id: 'endcap_20mm', category: 'fittings', name: '20mm End Cap', nameKannada: '20mm ಎಂಡ್ ಕ್ಯಾಪ್', size: '20mm', unit: 'Nos', unitType: 'default' },
  { id: 'endcap_25mm', category: 'fittings', name: '25mm End Cap', nameKannada: '25mm ಎಂಡ್ ಕ್ಯಾಪ್', size: '25mm', unit: 'Nos', unitType: 'default' },
  { id: 'endcap_32mm', category: 'fittings', name: '32mm End Cap', nameKannada: '32mm ಎಂಡ್ ಕ್ಯಾಪ್', size: '32mm', unit: 'Nos', unitType: 'default' },
  { id: 'endcap_50mm', category: 'fittings', name: '50mm End Cap', nameKannada: '50mm ಎಂಡ್ ಕ್ಯಾಪ್', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'endcap_63mm', category: 'fittings', name: '63mm End Cap', nameKannada: '63mm ಎಂಡ್ ಕ್ಯಾಪ್', size: '63mm', unit: 'Nos', unitType: 'default' },
  { id: 'endcap_75mm', category: 'fittings', name: '75mm End Cap', nameKannada: '75mm ಎಂಡ್ ಕ್ಯಾಪ್', size: '75mm', unit: 'Nos', unitType: 'default' },
  // Reducers (RB)
  { id: 'rb_63x50', category: 'fittings', name: '63x50mm RB', nameKannada: '63x50mm ಆರ್‌ಬಿ', size: '63x50mm', unit: 'Nos', unitType: 'default' },
  { id: 'rb_75x63', category: 'fittings', name: '75x63mm RB', nameKannada: '75x63mm ಆರ್‌ಬಿ', size: '75x63mm', unit: 'Nos', unitType: 'default' },
  { id: 'rb_90x75', category: 'fittings', name: '90x75mm RB', nameKannada: '90x75mm ಆರ್‌ಬಿ', size: '90x75mm', unit: 'Nos', unitType: 'default' },
  { id: 'rb_110x90', category: 'fittings', name: '110x90mm RB', nameKannada: '110x90mm ಆರ್‌ಬಿ', size: '110x90mm', unit: 'Nos', unitType: 'default' },
  { id: 'rb_50x40', category: 'fittings', name: '50x40mm RB', nameKannada: '50x40mm ಆರ್‌ಬಿ', size: '50x40mm', unit: 'Nos', unitType: 'default' },
  { id: 'rb_40x32', category: 'fittings', name: '40x32mm RB', nameKannada: '40x32mm ಆರ್‌ಬಿ', size: '40x32mm', unit: 'Nos', unitType: 'default' },
  // MTA
  { id: 'mta_20mm', category: 'fittings', name: '20mm MTA', nameKannada: '20mm MTA', size: '20mm', unit: 'Nos', unitType: 'default' },
  { id: 'mta_25mm', category: 'fittings', name: '25mm MTA', nameKannada: '25mm MTA', size: '25mm', unit: 'Nos', unitType: 'default' },
  { id: 'mta_32mm', category: 'fittings', name: '32mm MTA', nameKannada: '32mm MTA', size: '32mm', unit: 'Nos', unitType: 'default' },
  { id: 'mta_50mm', category: 'fittings', name: '50mm MTA', nameKannada: '50mm MTA', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'mta_63mm', category: 'fittings', name: '63mm MTA', nameKannada: '63mm MTA', size: '63mm', unit: 'Nos', unitType: 'default' },
  // FTA
  { id: 'fta_20mm', category: 'fittings', name: '20mm FTA', nameKannada: '20mm FTA', size: '20mm', unit: 'Nos', unitType: 'default' },
  { id: 'fta_25mm', category: 'fittings', name: '25mm FTA', nameKannada: '25mm FTA', size: '25mm', unit: 'Nos', unitType: 'default' },
  { id: 'fta_32mm', category: 'fittings', name: '32mm FTA', nameKannada: '32mm FTA', size: '32mm', unit: 'Nos', unitType: 'default' },
  { id: 'fta_50mm', category: 'fittings', name: '50mm FTA', nameKannada: '50mm FTA', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'fta_63mm', category: 'fittings', name: '63mm FTA', nameKannada: '63mm FTA', size: '63mm', unit: 'Nos', unitType: 'default' },
  // Sockets
  { id: 'socket_50mm', category: 'fittings', name: '50mm Socket', nameKannada: '50mm ಸಾಕೆಟ್', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'socket_63mm', category: 'fittings', name: '63mm Socket', nameKannada: '63mm ಸಾಕೆಟ್', size: '63mm', unit: 'Nos', unitType: 'default' },
  { id: 'socket_75mm', category: 'fittings', name: '75mm Socket', nameKannada: '75mm ಸಾಕೆಟ್', size: '75mm', unit: 'Nos', unitType: 'default' },
  // Union
  { id: 'union_50mm', category: 'fittings', name: '50mm Union', nameKannada: '50mm ಯೂನಿಯನ್', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'union_63mm', category: 'fittings', name: '63mm Union', nameKannada: '63mm ಯೂನಿಯನ್', size: '63mm', unit: 'Nos', unitType: 'default' },
  { id: 'union_75mm', category: 'fittings', name: '75mm Union', nameKannada: '75mm ಯೂನಿಯನ್', size: '75mm', unit: 'Nos', unitType: 'default' },

  // ========== VALVES & NRV ==========
  { id: 'ball_valve_50mm', category: 'valves', name: '50mm Ball Valve', nameKannada: '50mm ಬಾಲ್ ವಾಲ್ವ್', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'ball_valve_63mm', category: 'valves', name: '63mm Ball Valve', nameKannada: '63mm ಬಾಲ್ ವಾಲ್ವ್', size: '63mm', unit: 'Nos', unitType: 'default' },
  { id: 'ball_valve_75mm', category: 'valves', name: '75mm Ball Valve', nameKannada: '75mm ಬಾಲ್ ವಾಲ್ವ್', size: '75mm', unit: 'Nos', unitType: 'default' },
  { id: 'ball_valve_2inch', category: 'valves', name: '2" Ball Valve', nameKannada: '2" ಬಾಲ್ ವಾಲ್ವ್', size: '2"', unit: 'Nos', unitType: 'default' },
  { id: 'spring_nrv_50mm', category: 'valves', name: '50mm Spring NRV', nameKannada: '50mm ಸ್ಪ್ರಿಂಗ್ NRV', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'spring_nrv_63mm', category: 'valves', name: '63mm Spring NRV', nameKannada: '63mm ಸ್ಪ್ರಿಂಗ್ NRV', size: '63mm', unit: 'Nos', unitType: 'default' },
  { id: 'spring_nrv_75mm', category: 'valves', name: '75mm Spring NRV', nameKannada: '75mm ಸ್ಪ್ರಿಂಗ್ NRV', size: '75mm', unit: 'Nos', unitType: 'default' },
  { id: 'gate_valve_50mm', category: 'valves', name: '50mm Gate Valve', nameKannada: '50mm ಗೇಟ್ ವಾಲ್ವ್', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'gate_valve_63mm', category: 'valves', name: '63mm Gate Valve', nameKannada: '63mm ಗೇಟ್ ವಾಲ್ವ್', size: '63mm', unit: 'Nos', unitType: 'default' },
  { id: 'butterfly_valve', category: 'valves', name: 'Butterfly Valve', nameKannada: 'ಬಟರ್‌ಫ್ಲೈ ವಾಲ್ವ್', size: '', unit: 'Nos', unitType: 'default' },

  // ========== DRAINS, INLETS, NOZZLES ==========
  { id: 'main_drain_abs', category: 'drains', name: 'ABS Main Drain Plate with Screw', nameKannada: 'ABS ಮೈನ್ ಡ್ರೈನ್ ಪ್ಲೇಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'main_drain_ss', category: 'drains', name: 'SS Main Drain Plate', nameKannada: 'SS ಮೈನ್ ಡ್ರೈನ್ ಪ್ಲೇಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'skimmer_abs', category: 'drains', name: 'ABS Skimmer Plate', nameKannada: 'ABS ಸ್ಕಿಮ್ಮರ್ ಪ್ಲೇಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'skimmer_ss', category: 'drains', name: 'SS Skimmer Plate', nameKannada: 'SS ಸ್ಕಿಮ್ಮರ್ ಪ್ಲೇಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'wall_inlet_abs', category: 'drains', name: 'ABS Wall Inlet', nameKannada: 'ABS ವಾಲ್ ಇನ್‌ಲೆಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'wall_inlet_ss', category: 'drains', name: 'SS Wall Inlet', nameKannada: 'SS ವಾಲ್ ಇನ್‌ಲೆಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'suction_socket', category: 'drains', name: 'Suction Socket', nameKannada: 'ಸಕ್ಷನ್ ಸಾಕೆಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'floor_inlet', category: 'drains', name: 'Floor Inlet', nameKannada: 'ಫ್ಲೋರ್ ಇನ್‌ಲೆಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'air_nozzle', category: 'drains', name: 'Air Nozzle', nameKannada: 'ಏರ್ ನಾಜಲ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'overflow_grating', category: 'drains', name: 'Overflow Grating', nameKannada: 'ಓವರ್‌ಫ್ಲೋ ಗ್ರೇಟಿಂಗ್', size: '', unit: 'Meter', unitType: 'pipes' },
  { id: 'vacuum_point', category: 'drains', name: 'Vacuum Point', nameKannada: 'ವ್ಯಾಕ್ಯೂಮ್ ಪಾಯಿಂಟ್', size: '', unit: 'Nos', unitType: 'default' },

  // ========== LIGHTS & ELECTRICAL ==========
  { id: 'led_light_12w', category: 'lights', name: 'LED Underwater Light 12W', nameKannada: 'LED ಅಂಡರ್‌ವಾಟರ್ ಲೈಟ್ 12W', size: '12W', unit: 'Nos', unitType: 'default' },
  { id: 'led_light_18w', category: 'lights', name: 'LED Underwater Light 18W', nameKannada: 'LED ಅಂಡರ್‌ವಾಟರ್ ಲೈಟ್ 18W', size: '18W', unit: 'Nos', unitType: 'default' },
  { id: 'led_light_24w', category: 'lights', name: 'LED Underwater Light 24W', nameKannada: 'LED ಅಂಡರ್‌ವಾಟರ್ ಲೈಟ್ 24W', size: '24W', unit: 'Nos', unitType: 'default' },
  { id: 'light_driver', category: 'lights', name: 'LED Driver', nameKannada: 'LED ಡ್ರೈವರ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'light_niche', category: 'lights', name: 'Light Niche', nameKannada: 'ಲೈಟ್ ನಿಚ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'controller', category: 'lights', name: 'Controller', nameKannada: 'ಕಂಟ್ರೋಲರ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'push_button', category: 'lights', name: 'Push Button', nameKannada: 'ಪುಶ್ ಬಟನ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'cable_1.5sqmm', category: 'lights', name: '1.5 sqmm Cable', nameKannada: '1.5 sqmm ಕೇಬಲ್', size: '1.5 sqmm', unit: 'Meter', unitType: 'cables' },
  { id: 'cable_2.5sqmm', category: 'lights', name: '2.5 sqmm Cable', nameKannada: '2.5 sqmm ಕೇಬಲ್', size: '2.5 sqmm', unit: 'Meter', unitType: 'cables' },
  { id: 'cable_4sqmm', category: 'lights', name: '4 sqmm Cable', nameKannada: '4 sqmm ಕೇಬಲ್', size: '4 sqmm', unit: 'Meter', unitType: 'cables' },
  { id: 'cable_3core', category: 'lights', name: '3 Core Cable', nameKannada: '3 ಕೋರ್ ಕೇಬಲ್', size: '3 Core', unit: 'Meter', unitType: 'cables' },
  { id: 'duck_box', category: 'lights', name: 'Duck Box (Junction Box)', nameKannada: 'ಡಕ್ ಬಾಕ್ಸ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'mcb_box', category: 'lights', name: 'MCB Box', nameKannada: 'MCB ಬಾಕ್ಸ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'mcb', category: 'lights', name: 'MCB', nameKannada: 'MCB', size: '', unit: 'Nos', unitType: 'default' },

  // ========== CHEMICALS & SOLVENTS ==========
  { id: 'pvc_solvent_small', category: 'chemicals', name: 'PVC Solvent (Small)', nameKannada: 'PVC ಸಾಲ್ವೆಂಟ್ (ಸಣ್ಣ)', size: '100ml', unit: 'Nos', unitType: 'solvents' },
  { id: 'pvc_solvent_large', category: 'chemicals', name: 'PVC Solvent (Large)', nameKannada: 'PVC ಸಾಲ್ವೆಂಟ್ (ದೊಡ್ಡ)', size: '500ml', unit: 'Nos', unitType: 'solvents' },
  { id: 'upvc_solvent', category: 'chemicals', name: 'UPVC Solvent', nameKannada: 'UPVC ಸಾಲ್ವೆಂಟ್', size: '', unit: 'Liter', unitType: 'solvents' },
  { id: 'holdtite', category: 'chemicals', name: 'Holdtite', nameKannada: 'ಹೋಲ್ಡ್‌ಟೈಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'mseal', category: 'chemicals', name: 'M-Seal', nameKannada: 'M-ಸೀಲ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'thread_ball', category: 'chemicals', name: 'Thread Ball (Teflon)', nameKannada: 'ಥ್ರೆಡ್ ಬಾಲ್ (ಟೆಫ್ಲಾನ್)', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'silicon_sealant', category: 'chemicals', name: 'Silicon Sealant', nameKannada: 'ಸಿಲಿಕಾನ್ ಸೀಲೆಂಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'araldite', category: 'chemicals', name: 'Araldite', nameKannada: 'ಅರಾಲ್ಡೈಟ್', size: '', unit: 'Nos', unitType: 'default' },

  // ========== FASTENERS & SUPPORTS ==========
  { id: 'wall_bracket', category: 'fasteners', name: 'Wall Bracket', nameKannada: 'ವಾಲ್ ಬ್ರಾಕೆಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'pipe_clamp_50mm', category: 'fasteners', name: '50mm Pipe Clamp', nameKannada: '50mm ಪೈಪ್ ಕ್ಲ್ಯಾಂಪ್', size: '50mm', unit: 'Nos', unitType: 'default' },
  { id: 'pipe_clamp_63mm', category: 'fasteners', name: '63mm Pipe Clamp', nameKannada: '63mm ಪೈಪ್ ಕ್ಲ್ಯಾಂಪ್', size: '63mm', unit: 'Nos', unitType: 'default' },
  { id: 'pipe_clamp_75mm', category: 'fasteners', name: '75mm Pipe Clamp', nameKannada: '75mm ಪೈಪ್ ಕ್ಲ್ಯಾಂಪ್', size: '75mm', unit: 'Nos', unitType: 'default' },
  { id: 'u_bolt_small', category: 'fasteners', name: 'U-Bolt (Small)', nameKannada: 'U-ಬೋಲ್ಟ್ (ಸಣ್ಣ)', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'u_bolt_large', category: 'fasteners', name: 'U-Bolt (Large)', nameKannada: 'U-ಬೋಲ್ಟ್ (ದೊಡ್ಡ)', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'bolt_nut_set', category: 'fasteners', name: 'Bolt & Nut Set', nameKannada: 'ಬೋಲ್ಟ್ & ನಟ್ ಸೆಟ್', size: '', unit: 'Set', unitType: 'default' },
  { id: 'nails_2inch', category: 'fasteners', name: '2" Nails', nameKannada: '2" ಮೊಳೆ', size: '2"', unit: 'Kg', unitType: 'nails' },
  { id: 'nails_3inch', category: 'fasteners', name: '3" Nails', nameKannada: '3" ಮೊಳೆ', size: '3"', unit: 'Kg', unitType: 'nails' },
  { id: 'concrete_screw', category: 'fasteners', name: 'Concrete Screw', nameKannada: 'ಕಾಂಕ್ರೀಟ್ ಸ್ಕ್ರೂ', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'anchor_bolt', category: 'fasteners', name: 'Anchor Bolt', nameKannada: 'ಆಂಕರ್ ಬೋಲ್ಟ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'gi_wire', category: 'fasteners', name: 'GI Wire', nameKannada: 'GI ವೈರ್', size: '', unit: 'Kg', unitType: 'default' },

  // ========== ACCESSORIES & TOOLS ==========
  { id: 'waterproof_tape', category: 'accessories', name: 'Waterproof Tape', nameKannada: 'ವಾಟರ್‌ಪ್ರೂಫ್ ಟೇಪ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'teflon_tape', category: 'accessories', name: 'Teflon Tape', nameKannada: 'ಟೆಫ್ಲಾನ್ ಟೇಪ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'insulation_tape', category: 'accessories', name: 'Insulation Tape', nameKannada: 'ಇನ್ಸುಲೇಶನ್ ಟೇಪ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'hose_pipe', category: 'accessories', name: 'Hose Pipe', nameKannada: 'ಹೋಸ್ ಪೈಪ್', size: '', unit: 'Meter', unitType: 'pipes' },
  { id: 'hose_clip', category: 'accessories', name: 'Hose Clip', nameKannada: 'ಹೋಸ್ ಕ್ಲಿಪ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'pump_strainer', category: 'accessories', name: 'Pump Strainer', nameKannada: 'ಪಂಪ್ ಸ್ಟ್ರೈನರ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'pressure_gauge', category: 'accessories', name: 'Pressure Gauge', nameKannada: 'ಪ್ರೆಶರ್ ಗೇಜ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'vacuum_hose', category: 'accessories', name: 'Vacuum Hose', nameKannada: 'ವ್ಯಾಕ್ಯೂಮ್ ಹೋಸ್', size: '', unit: 'Meter', unitType: 'pipes' },
  { id: 'pool_ladder', category: 'accessories', name: 'Pool Ladder', nameKannada: 'ಪೂಲ್ ಲ್ಯಾಡರ್', size: '', unit: 'Nos', unitType: 'default' },
  { id: 'grab_rail', category: 'accessories', name: 'Grab Rail', nameKannada: 'ಗ್ರ್ಯಾಬ್ ರೇಲ್', size: '', unit: 'Nos', unitType: 'default' },
];

// Predefined site names for quick selection
export const siteNames = [
  'Adarsha Farm',
  'Hotel Project',
  'Apartment Complex',
  'Villa Project',
  'Resort',
  'Club House',
  'School',
  'Hospital',
];

// Get materials by category
export const getMaterialsByCategory = (categoryId) => {
  return materials.filter(m => m.category === categoryId);
};

// Get category by ID
export const getCategoryById = (categoryId) => {
  return categories.find(c => c.id === categoryId);
};

// Get material by ID
export const getMaterialById = (materialId) => {
  return materials.find(m => m.id === materialId);
};

// Get unit options for a material
export const getUnitOptions = (unitType) => {
  return unitOptions[unitType] || null;
};
