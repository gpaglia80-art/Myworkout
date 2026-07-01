import { useState, useEffect, useRef } from "react";
import { Menu, X, Play, Pause, RotateCcw, Moon, BookOpen, ArrowLeft, Info } from "lucide-react";

const TR = {
  IT:{appName:"Home Workout",selectDay:"Seleziona giorno",level:"Livello",language:"Lingua",beginner:"Principiante",intermediate:"Intermedio",hard:"Avanzato",restDay:"Giorno di Riposo",restDesc:"Recupero attivo: cammina 20–30 min oppure stretching dolce.",series:"Serie",reps:"Rip.",timerLabel:"Timer",start:"Avvia",pause:"Pausa",reset:"Reset",altLabel:"Scegli alternativa",mainExercise:"Esercizio principale",library:"Libreria Esercizi",allExercises:"esercizi totali",note:"⚠️ Collo sempre neutro — stop se senti dolore alla cervicale.",alternatives:"Alternative",close:"Chiudi",
    days:{monday:"Lunedì",tuesday:"Martedì",wednesday:"Mercoledì",thursday:"Giovedì",friday:"Venerdì",saturday:"Sabato",sunday:"Domenica"},
    dayType:{monday:"Lower Body + Core",tuesday:"Riposo Attivo",wednesday:"Upper Body + Core",thursday:"Cardio",friday:"Riposo Completo",saturday:"Full Body",sunday:"Riposo Completo"}},
  EN:{appName:"Home Workout",selectDay:"Select day",level:"Level",language:"Language",beginner:"Beginner",intermediate:"Intermediate",hard:"Advanced",restDay:"Rest Day",restDesc:"Active recovery: walk 20–30 min or light stretching.",series:"Sets",reps:"Reps",timerLabel:"Timer",start:"Start",pause:"Pause",reset:"Reset",altLabel:"Choose alternative",mainExercise:"Main exercise",library:"Exercise Library",allExercises:"total exercises",note:"⚠️ Keep neck neutral — stop if you feel cervical pain.",alternatives:"Alternatives",close:"Close",
    days:{monday:"Monday",tuesday:"Tuesday",wednesday:"Wednesday",thursday:"Thursday",friday:"Friday",saturday:"Saturday",sunday:"Sunday"},
    dayType:{monday:"Lower Body + Core",tuesday:"Active Rest",wednesday:"Upper Body + Core",thursday:"Cardio",friday:"Full Rest",saturday:"Full Body",sunday:"Full Rest"}},
  ES:{appName:"Entrena en Casa",selectDay:"Selecciona día",level:"Nivel",language:"Idioma",beginner:"Principiante",intermediate:"Intermedio",hard:"Avanzado",restDay:"Día de Descanso",restDesc:"Recuperación activa: camina 20–30 min o estiramientos suaves.",series:"Series",reps:"Reps",timerLabel:"Temporizador",start:"Iniciar",pause:"Pausa",reset:"Reiniciar",altLabel:"Elegir alternativa",mainExercise:"Ejercicio principal",library:"Biblioteca",allExercises:"ejercicios totales",note:"⚠️ Cuello siempre neutro — detente si sientes dolor cervical.",alternatives:"Alternativas",close:"Cerrar",
    days:{monday:"Lunes",tuesday:"Martes",wednesday:"Miércoles",thursday:"Jueves",friday:"Viernes",saturday:"Sábado",sunday:"Domingo"},
    dayType:{monday:"Tren inferior + Core",tuesday:"Descanso activo",wednesday:"Tren superior + Core",thursday:"Cardio",friday:"Descanso completo",saturday:"Cuerpo completo",sunday:"Descanso completo"}},
};

const DESCRIPTIONS = {
  wu_mon:{IT:"Dedica 5-8 minuti a movimenti leggeri: marcia sul posto, rotazioni delle spalle e dei fianchi. L'obiettivo è alzare la temperatura corporea, attivare la circolazione e lubrificare le articolazioni. Mantieni sempre il collo rilassato, non fare mai rotazioni forzate.",EN:"Spend 5-8 minutes on light movements: march in place, shoulder and hip rotations. Goal: raise body temperature, activate circulation, lubricate joints. Always keep neck relaxed — no forced rotations.",ES:"Dedica 5-8 minutos a movimientos suaves: marcha en el sitio, rotaciones de hombros y caderas. Objetivo: elevar la temperatura corporal, activar la circulación y lubricar las articulaciones."},
  squat:{IT:"Piedi larghezza spalle, punte leggermente aperte. Scendi come su una sedia: schiena dritta, peso sui talloni, ginocchia in linea con le punte. Sguardo sempre avanti. Risali spingendo con i talloni. Non lasciare che le ginocchia collassino verso l'interno.",EN:"Feet shoulder-width apart, toes slightly out. Lower as if sitting in a chair: straight back, weight on heels, knees aligned with toes. Always look forward. Rise by pressing through heels. Don't let knees cave inward.",ES:"Pies al ancho de hombros, puntas abiertas. Baja como sentarte en una silla: espalda recta, peso en talones, rodillas sobre puntas. Sube empujando con los talones. No dejes que las rodillas caigan hacia dentro."},
  lunges:{IT:"Passo lungo in avanti, piega il ginocchio anteriore a 90° (non oltre la punta del piede). Il ginocchio posteriore sfiora il pavimento. Busto eretto, sguardo avanti. Ritorna e alterna le gambe. Tieni il core attivo per la stabilità.",EN:"Step forward, bend front knee to 90° (not past toes). Rear knee grazes the floor. Upright torso, look forward. Return and alternate legs. Keep core engaged for stability.",ES:"Da un paso al frente, dobla la rodilla delantera a 90° (sin sobrepasar los pies). La rodilla trasera roza el suelo. Tronco erguido. Vuelve y alterna piernas."},
  bridge:{IT:"Sdraiato sulla schiena, ginocchia piegate, piedi piatti a terra. Spingi i fianchi verso il soffitto contraendo i glutei. La schiena lombare si solleva, le spalle restano a terra. Scendi lentamente. Ottimo per attivare i glutei e scaricare la lombare.",EN:"Lie on back, knees bent, feet flat. Push hips toward ceiling squeezing glutes. Lower back lifts, shoulders stay grounded. Lower slowly. Great for glute activation and lower back decompression.",ES:"Tumbado de espaldas, rodillas dobladas, pies en el suelo. Empuja las caderas hacia el techo contrayendo los glúteos. La lumbar sube, los hombros quedan en el suelo. Baja despacio."},
  wallsit:{IT:"Schiena piatta contro il muro, scendi fino a quando le coscie sono parallele al suolo e le ginocchia formano 90°. Mantieni la posizione statica. Eccellente esercizio isometrico per quadricipiti e glutei, zero impatto articolare.",EN:"Flat back against wall, lower until thighs are parallel to floor, knees at 90°. Hold the static position. Excellent isometric exercise for quads and glutes, zero joint impact.",ES:"Espalda plana contra la pared, baja hasta que los muslos estén paralelos al suelo y las rodillas a 90°. Mantén la posición estática. Excelente isométrico para cuádriceps y glúteos."},
  deadbug:{IT:"Sdraiato sulla schiena, FONDAMENTALE tenere la lombare incollata al suolo. Braccia verso il soffitto, gambe a 90°. Abbassa lentamente braccio destro + gamba sinistra senza mai staccare la schiena. Ritorna e alterna. Lavora in profondità il core senza stress sulla cervicale.",EN:"Lie on back — CRUCIAL: keep lower back pressed to floor throughout. Arms toward ceiling, legs at 90°. Slowly lower right arm + left leg without lifting your back. Return and alternate. Deep core work with zero cervical stress.",ES:"Tumbado de espaldas — CRUCIAL: mantener la lumbar pegada al suelo. Brazos al techo, piernas a 90°. Baja despacio brazo derecho + pierna izquierda sin despegar la espalda. Alterna. Trabaja el core profundo sin estrés cervical."},
  str_mon:{IT:"5-8 minuti di stretching statico. Mantieni ogni posizione 20-30 secondi senza rimbalzare. Priorità: flessori dell'anca (fondamentali dopo gli squat), quadricipiti, polpacci. Per la cervicale: solo inclinazioni laterali dolcissime.",EN:"5-8 minutes of static stretching. Hold each position 20-30 seconds without bouncing. Priority: hip flexors (crucial after squats), quads, calves. For the cervical spine: gentle side tilts only.",ES:"5-8 minutos de estiramiento estático. Mantén 20-30 segundos sin rebotar. Prioridad: flexores de cadera, cuádriceps, gemelos. Para la columna cervical: solo inclinaciones laterales suaves."},
  wu_wed:{IT:"Riscaldamento specifico per upper body: cerchi con le braccia avanti e indietro, rotazione del busto (non del collo!), swing delle braccia. 5-7 minuti. Attiva le spalle e prepara il petto prima del lavoro di spinta.",EN:"Upper body specific warm-up: arm circles forward and backward, torso rotations (not neck!), arm swings. 5-7 minutes. Activates shoulders and prepares chest before pushing work.",ES:"Calentamiento específico para tren superior: círculos de brazos adelante y atrás, rotaciones de torso (¡no del cuello!), balanceo de brazos. 5-7 minutos."},
  pushup:{IT:"Mani sotto le spalle, corpo in linea retta dalla testa ai talloni. Scendi piegando i gomiti a ~45°, petto sfiora il suolo. Risali. Collo neutro, sguardo leggermente avanti. Se necessario, modifica sulle ginocchia. Non abbassare i fianchi.",EN:"Hands under shoulders, body in straight line from head to heels. Lower bending elbows ~45°, chest grazes floor. Push up. Neutral neck, look slightly forward. Modify on knees if needed. Don't let hips sag.",ES:"Manos bajo los hombros, cuerpo en línea recta. Baja doblando los codos a ~45°, el pecho roza el suelo. Empuja arriba. Cuello neutro. Modifica en rodillas si es necesario."},
  widepush:{IT:"Come le flessioni standard ma mani più larghe delle spalle. Maggiore enfasi sul petto. Una discesa lenta di 3 secondi aumenta l'intensità senza aggiungere peso. Gomiti che vanno verso l'esterno più marcatamente.",EN:"Like standard push-ups but hands wider than shoulders. More chest emphasis. A 3-second slow descent increases intensity without adding weight. Elbows flare more outward.",ES:"Como flexiones estándar pero manos más abiertas. Mayor énfasis en el pecho. Un descenso lento de 3 segundos aumenta la intensidad sin añadir peso."},
  pike:{IT:"Parti in posizione a V rovesciata (come il downward dog). Piega i gomiti abbassando la testa TRA le mani fino a sfiorare il suolo. Spingi su. Movimento verticale — lavora i deltoidi anteriori. Collo naturale, sguardo verso i piedi o il suolo.",EN:"Start in inverted V (like downward dog). Bend elbows lowering head BETWEEN hands to nearly touch floor. Push up. Vertical movement — works anterior deltoids. Natural neck, look toward feet or floor.",ES:"Parte en V invertida (como perro boca abajo). Dobla los codos bajando la cabeza ENTRE las manos. Empuja arriba. Movimiento vertical, trabaja los deltoides anteriores."},
  plank:{IT:"Gomiti sotto le spalle, avambracci a terra, corpo in linea retta dalle spalle ai talloni. Addome contratto, glutei stretti. Collo neutro, sguardo verso il basso. Non alzare né abbassare i fianchi. Inizia con 20 secondi e aumenta ogni settimana.",EN:"Elbows under shoulders, forearms on floor, body in straight line from shoulders to heels. Abs tight, glutes squeezed. Neutral neck, look down. Don't raise or lower hips. Start with 20 seconds and increase weekly.",ES:"Codos bajo los hombros, antebrazos en el suelo, cuerpo en línea recta. Abdomen contraído, glúteos apretados. Cuello neutro. No subas ni bajes las caderas."},
  sideplank:{IT:"Corpo laterale, un gomito a terra sotto la spalla, fianchi sollevati formando una linea retta. Braccio libero verso il soffitto o sul fianco. Ottimo per gli obliqui e la stabilità laterale. Inizia con 15 secondi per lato, aumenta gradualmente.",EN:"Body sideways, one elbow on floor under shoulder, hips raised in straight line. Free arm toward ceiling or at side. Great for obliques and lateral stability. Start with 15 seconds per side, increase gradually.",ES:"Cuerpo lateral, un codo en el suelo bajo el hombro, caderas elevadas en línea recta. Excelente para los oblicuos y la estabilidad lateral."},
  birddog:{IT:"Quadrupedia: mani sotto le spalle, ginocchia sotto i fianchi, schiena piatta. Estendi LENTAMENTE braccio destro + gamba sinistra. Tieni 2-3 secondi. Ritorna e alterna. Non ruotare i fianchi — è l'errore più comune. Respira regolarmente.",EN:"Quadruped: hands under shoulders, knees under hips, flat back. SLOWLY extend right arm + left leg. Hold 2-3 seconds. Return and alternate. Don't rotate hips — most common mistake. Breathe regularly.",ES:"Cuadrupedia: manos bajo los hombros, rodillas bajo las caderas, espalda plana. Extiende LENTAMENTE brazo derecho + pierna izquierda. Mantén 2-3 segundos. No rotar las caderas."},
  str_wed:{IT:"Stretching per petto, spalle anteriori e tricipiti. Porta un braccio attraverso il petto con l'altro che lo trattiene. Per i tricipiti: gomito piegato dietro la testa, spingi dolcemente. Mantieni 20-30 secondi per posizione.",EN:"Stretching for chest, anterior deltoids and triceps. Pull one arm across chest held by the other. For triceps: elbow bent behind head, push gently. Hold 20-30 seconds per position.",ES:"Estiramientos para pecho, hombros anteriores y tríceps. Mantén 20-30 segundos por posición."},
  wu_thu:{IT:"Riscaldamento cardio leggero: marcia lenta sul posto con mobilità di caviglie, ginocchia e fianchi. Obiettivo: alzare gradualmente la frequenza cardiaca prima della sessione aerobica. Mantieni un ritmo confortevole.",EN:"Light cardio warm-up: slow march with ankle, knee and hip joint mobility. Goal: gradually raise heart rate before the aerobic session. Keep a comfortable pace.",ES:"Calentamiento cardio ligero: marcha lenta con movilidad de tobillos, rodillas y caderas. Objetivo: elevar gradualmente la frecuencia cardíaca."},
  march:{IT:"Marcia o corsa leggera sul posto alzando le ginocchia. Mantieni il ritmo per tutto il tempo. Braccia che oscillano naturalmente. Puoi alternare 1 minuto di marcia e 1 di corsa più veloce. Ideale per il cardio a casa senza attrezzatura.",EN:"March or light jog in place raising knees. Maintain rhythm throughout. Arms swing naturally. You can alternate 1 min march with 1 min faster jog. Ideal home cardio with no equipment.",ES:"Marcha o trote suave en el sitio levantando las rodillas. Mantén el ritmo. Los brazos oscilan naturalmente. Puedes alternar 1 min de marcha y 1 de trote más rápido."},
  stepup:{IT:"Stai di fronte a un gradino (15-20 cm). Appoggia TUTTO il piede destro sul gradino, spingi con il tallone e sali. Porta il piede sinistro su. Scendi con il sinistro per primo. Tutta la spinta deve venire dalla gamba sul gradino.",EN:"Stand in front of a step (15-20 cm). Place your ENTIRE right foot on step, push through heel and rise. Bring left foot up. Step down left foot first. All power must come from the leg on the step.",ES:"De pie frente a un escalón (15-20 cm). Apoya TODO el pie derecho en el escalón, empuja con el talón y sube. Baja primero el pie izquierdo. Toda la fuerza viene de la pierna en el escalón."},
  jack:{IT:"Versione basso impatto del jumping jack: porta un piede alla volta verso l'esterno invece di saltare. Le braccia si alzano lateralmente fino all'altezza delle spalle. Ottimo cardio senza impatto sulle ginocchia e senza rimbalzi che disturbano la cervicale.",EN:"Low-impact jumping jack: step one foot out at a time instead of jumping. Arms rise laterally to shoulder height. Great cardio without knee impact and no bouncing that strains the cervical spine.",ES:"Jumping jack de bajo impacto: mueve un pie a la vez en lugar de saltar. Los brazos suben lateralmente a la altura de los hombros. Cardio excelente sin impacto en rodillas ni rebotes cervicales."},
  sqtwist:{IT:"Squat completo, poi in risalita ruota il BUSTO (non il collo!) a destra o sinistra. La testa segue il busto come un tutt'uno. Alterna il lato. Lavora il core rotatorio e i muscoli obliqui senza alcun stress cervicale.",EN:"Full squat, then as you rise rotate the TORSO (not the neck!) right or left. Head follows torso as one unit. Alternate sides. Works rotational core and obliques with no cervical stress.",ES:"Sentadilla completa, luego al subir rota el TRONCO (¡no el cuello!) derecha o izquierda. La cabeza sigue el tronco. Alterna lados. Trabaja el core rotacional sin estrés cervical."},
  cd_thu:{IT:"5 minuti di marcia lenta per abbassare gradualmente la frequenza cardiaca. Respira profondo: inspira 4 secondi, espira 4 secondi. Lascia che il corpo torni alla normalità prima di iniziare lo stretching.",EN:"5 minutes of slow marching to gradually lower heart rate. Breathe deeply: 4 seconds inhale, 4 seconds exhale. Let the body return to normal before starting stretching.",ES:"5 minutos de marcha lenta para bajar gradualmente la frecuencia cardíaca. Respira: 4 segundos de inhalación, 4 de exhalación."},
  str_thu:{IT:"Stretching post-cardio globale: gambe (quadricipiti, ischio-crurali, polpacci), fianchi, schiena. 7-10 minuti totali, 25-30 secondi per posizione. Il cardio aumenta la temperatura muscolare: è il momento migliore per guadagnare flessibilità.",EN:"Post-cardio full body stretch: legs (quads, hamstrings, calves), hips, back. 7-10 minutes total, 25-30 seconds per position. Cardio raises muscle temperature: best time to gain flexibility.",ES:"Estiramiento post-cardio global: piernas, caderas, espalda. 7-10 minutos totales, 25-30 segundos por posición. El cardio calienta los músculos: el mejor momento para ganar flexibilidad."},
  wu_sat:{IT:"Riscaldamento dinamico full body: affondi camminati, oscillazioni delle gambe, piccoli saltelli. 5-8 minuti. Prepara tutto il corpo per la sessione più intensa della settimana. Aumenta gradualmente l'intensità.",EN:"Dynamic full body warm-up: walking lunges, leg swings, small jumps. 5-8 minutes. Prepares the whole body for the most intense session of the week. Gradually increase intensity.",ES:"Calentamiento dinámico de cuerpo completo: zancadas caminando, balanceos de piernas, pequeños saltos. 5-8 minutos."},
  sqpress:{IT:"Squat con le braccia lungo i fianchi. In risalita spingi le braccia verso il soffitto (come un military press). Con bottiglie d'acqua da 0.5-1 L aggiungi resistenza. Combina gambe, spalle e core in un unico movimento funzionale.",EN:"Squat with arms at sides. As you rise push arms toward ceiling (like a military press). Water bottles (0.5-1 L) add resistance. Combines legs, shoulders and core in one functional movement.",ES:"Sentadilla con brazos a los lados. Al subir, empuja los brazos al techo (como un press militar). Con botellas de agua (0,5-1 L) añades resistencia. Combina piernas, hombros y core."},
  pushrot:{IT:"Flessione completa. In cima alla spinta, ruota il corpo aprendo un braccio verso il soffitto (posizione a T). Testa e collo seguono il busto, non ruotano indipendentemente. Torna e ripeti dall'altro lato. Lavora stabilità, rotatori e core.",EN:"Complete push-up. At the top, rotate body opening one arm toward ceiling (T-position). Head and neck follow torso, they don't rotate independently. Return and repeat other side. Works stability, rotators and core.",ES:"Flexión completa. Al subir, rota el cuerpo abriendo un brazo al techo (posición T). Cabeza y cuello siguen el tronco. Trabaja estabilidad, rotadores y core."},
  sidelunge:{IT:"In piedi, fai un ampio passo laterale con il piede destro. Piega il ginocchio destro abbassando i fianchi, gamba sinistra tesa. Piede della gamba tesa punta avanti. Ritorna al centro e alterna. Lavora adduttori e abduttori, spesso trascurati.",EN:"Stand upright, take a wide lateral step right. Bend right knee lowering hips, left leg straight. Left foot points forward. Return to center and alternate. Works adductors and abductors, often neglected.",ES:"De pie, da un paso lateral amplio a la derecha. Dobla la rodilla derecha bajando caderas, pierna izquierda extendida. Vuelve al centro y alterna. Trabaja aductores y abductores."},
  bridgep:{IT:"Come il ponte glutei, ma tieni i fianchi alzati per 2-3 secondi in cima prima di scendere. La pausa isometrica aumenta significativamente l'attivazione dei glutei. Spingi i talloni nel suolo durante la pausa.",EN:"Like the glute bridge, but hold hips raised for 2-3 seconds at the top before lowering. The isometric pause significantly increases glute activation. Press heels into the floor during the hold.",ES:"Como el puente de glúteos, pero mantén las caderas elevadas 2-3 segundos en la cima. La pausa isométrica aumenta significativamente la activación de glúteos."},
  dynplank:{IT:"Parti dal plank sui gomiti. Sali al plank sulle mani: prima il palmo destro, poi il sinistro. Scendi: prima il gomito destro, poi il sinistro. Muoviti LENTAMENTE — i fianchi NON devono ruotare. Questo è l'errore più comune da evitare.",EN:"Start in elbow plank. Rise to hand plank: right palm first, then left. Lower: right elbow first, then left. Move SLOWLY — hips must NOT rotate. This is the most common mistake to avoid.",ES:"Comienza en plancha sobre codos. Sube: palma derecha, luego izquierda. Baja: codo derecho, luego izquierdo. Muévete LENTO — las caderas NO deben rotar. Es el error más común."},
  cardiofinish:{IT:"5-6 minuti di step-up continuo a ritmo sostenuto. Alterna le gambe senza fermarti. Le braccia aiutano il movimento. Se troppo intenso, riduci il ritmo ma non smettere. Obiettivo: portare la frequenza cardiaca al picco finale.",EN:"5-6 minutes of continuous step-up at sustained pace. Alternate legs without stopping. Arms help with movement. If too intense, reduce pace but keep going. Goal: bring heart rate to final peak.",ES:"5-6 minutos de subidas continuas al escalón. Alterna piernas sin parar. Los brazos ayudan. Si es demasiado intenso, reduce el ritmo pero no pares. Objetivo: frecuencia cardíaca al máximo final."},
  str_sat:{IT:"Stretching completo dopo la sessione più intensa. Gambe, fianchi, petto, spalle, schiena. 8-10 minuti totali, 25-30 secondi per posizione senza rimbalzare. Respira profondo in ogni posizione. Dopo il full body è il momento migliore per guadagnare flessibilità.",EN:"Complete stretch after the most intense session. Legs, hips, chest, shoulders, back. 8-10 minutes total, 25-30 seconds per position without bouncing. Breathe deeply in each position. Best time for flexibility gains.",ES:"Estiramiento completo tras la sesión más intensa. Piernas, caderas, pecho, hombros, espalda. 8-10 minutos totales. Respira profundo. El mejor momento para ganar flexibilidad."},
};

function ExSVG({ type, color="#3b82f6", size=80 }) {
  const h=size*0.875, c=color, sw=2.8, sl="round";
  const H=({cx,cy,r=6})=><circle cx={cx} cy={cy} r={r} fill={c} opacity="0.9"/>;
  const L=({x1,y1,x2,y2,w=sw})=><line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} strokeLinecap={sl}/>;
  const G=({y=66})=><line x1="8" y1={y} x2="72" y2={y} stroke={c} strokeWidth="1" opacity="0.2"/>;
  const figs={
    warmup:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="40" cy="8"/><L x1="40" y1="14" x2="40" y2="38"/><L x1="40" y1="22" x2="24" y2="14"/><L x1="40" y1="22" x2="56" y2="14"/><L x1="40" y1="38" x2="30" y2="56"/><L x1="40" y1="38" x2="50" y2="56"/><L x1="30" y1="56" x2="28" y2="66"/><L x1="50" y1="56" x2="52" y2="66"/><G/></svg>,
    squat:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="40" cy="7"/><L x1="40" y1="13" x2="39" y2="31"/><L x1="39" y1="20" x2="22" y2="26"/><L x1="39" y1="20" x2="56" y2="26"/><L x1="39" y1="31" x2="24" y2="50"/><L x1="39" y1="31" x2="54" y2="50"/><L x1="24" y1="50" x2="21" y2="64"/><L x1="54" y1="50" x2="57" y2="64"/><G/></svg>,
    lunge:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="38" cy="7"/><L x1="38" y1="13" x2="38" y2="33"/><L x1="38" y1="20" x2="26" y2="26"/><L x1="38" y1="20" x2="50" y2="26"/><L x1="38" y1="33" x2="26" y2="52"/><L x1="38" y1="33" x2="54" y2="47"/><L x1="26" y1="52" x2="24" y2="64"/><L x1="54" y1="47" x2="64" y2="64"/><G/></svg>,
    bridge:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="12" cy="42" r={5}/><L x1="18" y1="42" x2="36" y2="38"/><L x1="36" y1="38" x2="48" y2="24"/><L x1="48" y1="24" x2="56" y2="42"/><L x1="36" y1="38" x2="28" y2="50"/><L x1="28" y1="50" x2="18" y2="55"/><L x1="56" y1="42" x2="60" y2="58"/><L x1="18" y1="55" x2="12" y2="60"/><G y={62}/></svg>,
    wallsit:<svg viewBox="0 0 80 72" width={size} height={h}><L x1="68" y1="4" x2="68" y2="66" w={3}/><H cx="58" cy="10"/><L x1="58" y1="16" x2="60" y2="35"/><L x1="60" y1="24" x2="46" y2="20"/><L x1="60" y1="24" x2="68" y2="20"/><L x1="60" y1="35" x2="44" y2="35"/><L x1="44" y1="35" x2="34" y2="60"/><L x1="60" y1="35" x2="68" y2="60"/><G/></svg>,
    deadbug:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="40" cy="35"/><L x1="40" y1="41" x2="40" y2="55"/><L x1="40" y1="46" x2="28" y2="50"/><L x1="40" y1="46" x2="52" y2="50"/><L x1="22" y1="8" x2="40" y2="46"/><L x1="58" y1="8" x2="40" y2="55"/><L x1="40" y1="55" x2="30" y2="62"/><L x1="40" y1="55" x2="50" y2="62"/><G y={70}/></svg>,
    pushup:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="13" cy="26" r={5}/><L x1="19" y1="26" x2="50" y2="30"/><L x1="25" y1="27" x2="22" y2="40"/><L x1="50" y1="30" x2="68" y2="30"/><L x1="50" y1="30" x2="53" y2="44"/><L x1="22" y1="40" x2="16" y2="42"/><L x1="53" y1="44" x2="47" y2="46"/><G y={46}/></svg>,
    pike:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="40" cy="18"/><L x1="40" y1="24" x2="26" y2="42"/><L x1="40" y1="24" x2="54" y2="42"/><L x1="26" y1="42" x2="20" y2="62"/><L x1="54" y1="42" x2="60" y2="62"/><L x1="26" y1="30" x2="16" y2="42"/><L x1="54" y1="30" x2="64" y2="42"/><G/></svg>,
    plank:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="10" cy="32" r={5}/><L x1="16" y1="32" x2="64" y2="36"/><L x1="22" y1="33" x2="20" y2="46"/><L x1="60" y1="35" x2="62" y2="46"/><L x1="20" y1="46" x2="14" y2="48"/><L x1="62" y1="46" x2="56" y2="48"/><G y={50}/></svg>,
    sideplank:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="14" cy="30" r={5}/><L x1="20" y1="30" x2="58" y2="44"/><L x1="36" y1="37" x2="34" y2="20"/><L x1="34" y1="20" x2="28" y2="12"/><L x1="36" y1="44" x2="58" y2="52"/><L x1="58" y1="44" x2="62" y2="52"/><G y={54}/></svg>,
    birddog:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="42" cy="22"/><L x1="42" y1="28" x2="42" y2="42"/><L x1="42" y1="34" x2="28" y2="34"/><L x1="42" y1="34" x2="56" y2="34"/><L x1="42" y1="42" x2="28" y2="50"/><L x1="42" y1="42" x2="56" y2="50"/><L x1="28" y1="34" x2="14" y2="30"/><L x1="56" y1="50" x2="70" y2="46"/><L x1="28" y1="50" x2="26" y2="58"/><G y={60}/></svg>,
    run:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="46" cy="8"/><L x1="46" y1="14" x2="40" y2="32"/><L x1="44" y1="22" x2="56" y2="16"/><L x1="44" y1="22" x2="30" y2="28"/><L x1="40" y1="32" x2="52" y2="48"/><L x1="40" y1="32" x2="28" y2="44"/><L x1="52" y1="48" x2="62" y2="56"/><L x1="28" y1="44" x2="18" y2="38"/><G/></svg>,
    stepup:<svg viewBox="0 0 80 72" width={size} height={h}><rect x="36" y="46" width="38" height="16" rx="2" fill={c} opacity="0.15" stroke={c} strokeWidth="1.5"/><H cx="32" cy="14"/><L x1="32" y1="20" x2="32" y2="38"/><L x1="32" y1="27" x2="20" y2="22"/><L x1="32" y1="27" x2="44" y2="22"/><L x1="32" y1="38" x2="20" y2="56"/><L x1="32" y1="38" x2="44" y2="46"/><L x1="20" y1="56" x2="18" y2="64"/><G/></svg>,
    jumping:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="40" cy="12"/><L x1="40" y1="18" x2="40" y2="38"/><L x1="40" y1="24" x2="18" y2="18"/><L x1="40" y1="24" x2="62" y2="18"/><L x1="40" y1="38" x2="22" y2="56"/><L x1="40" y1="38" x2="58" y2="56"/><L x1="22" y1="56" x2="14" y2="62"/><L x1="58" y1="56" x2="66" y2="62"/><G/></svg>,
    twist:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="40" cy="8"/><L x1="40" y1="14" x2="40" y2="33"/><L x1="40" y1="22" x2="58" y2="17"/><L x1="40" y1="22" x2="24" y2="30"/><L x1="40" y1="33" x2="30" y2="52"/><L x1="40" y1="33" x2="50" y2="52"/><L x1="30" y1="52" x2="28" y2="64"/><L x1="50" y1="52" x2="52" y2="64"/><G/></svg>,
    sqpress:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="40" cy="7"/><L x1="40" y1="13" x2="39" y2="32"/><L x1="39" y1="18" x2="24" y2="8"/><L x1="39" y1="18" x2="54" y2="8"/><L x1="39" y1="32" x2="24" y2="50"/><L x1="39" y1="32" x2="54" y2="50"/><L x1="24" y1="50" x2="21" y2="64"/><L x1="54" y1="50" x2="57" y2="64"/><G/></svg>,
    stretch:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="40" cy="8"/><L x1="40" y1="14" x2="40" y2="36"/><L x1="40" y1="22" x2="56" y2="30"/><L x1="40" y1="22" x2="28" y2="16"/><L x1="40" y1="36" x2="30" y2="55"/><L x1="40" y1="36" x2="50" y2="55"/><L x1="30" y1="55" x2="28" y2="65"/><L x1="50" y1="55" x2="52" y2="65"/><G/></svg>,
    breathe:<svg viewBox="0 0 80 72" width={size} height={h}><H cx="40" cy="8"/><L x1="40" y1="14" x2="40" y2="36"/><L x1="40" y1="22" x2="26" y2="30"/><L x1="40" y1="22" x2="54" y2="30"/><L x1="40" y1="36" x2="30" y2="55"/><L x1="40" y1="36" x2="50" y2="55"/><L x1="30" y1="55" x2="28" y2="65"/><L x1="50" y1="55" x2="52" y2="65"/><ellipse cx="40" cy="27" rx="9" ry="5" fill="none" stroke={c} strokeWidth="1.2" opacity="0.5"/><G/></svg>,
  };
  return figs[type]||figs.warmup;
}

const EX_SVG_TYPE={wu_mon:"warmup",wu_wed:"warmup",wu_thu:"warmup",wu_sat:"warmup",squat:"squat",lunges:"lunge",bridge:"bridge",wallsit:"wallsit",deadbug:"deadbug",str_mon:"stretch",str_wed:"stretch",str_thu:"stretch",str_sat:"stretch",pushup:"pushup",widepush:"pushup",pike:"pike",plank:"plank",sideplank:"sideplank",birddog:"birddog",march:"run",stepup:"stepup",jack:"jumping",sqtwist:"twist",cd_thu:"breathe",sqpress:"sqpress",pushrot:"pushup",sidelunge:"lunge",bridgep:"bridge",dynplank:"plank",cardiofinish:"stepup"};

const DB={
  monday:[
    {id:"wu_mon",names:{IT:"Riscaldamento",EN:"Warm-up",ES:"Calentamiento"},timer:360,levels:{beginner:{s:1,r:"5 min"},intermediate:{s:1,r:"7 min"},hard:{s:1,r:"8 min"}},alts:[{id:"a1",names:{IT:"Marcia sul posto",EN:"Marching in place",ES:"Marcha en el sitio"}},{id:"a2",names:{IT:"Rotazione spalle",EN:"Shoulder rolls",ES:"Rotación de hombros"}},{id:"a3",names:{IT:"Cerchi con le anche",EN:"Hip circles",ES:"Círculos de cadera"}}]},
    {id:"squat",names:{IT:"Squat a corpo libero",EN:"Bodyweight Squat",ES:"Sentadilla libre"},timer:50,levels:{beginner:{s:2,r:"10"},intermediate:{s:3,r:"15"},hard:{s:4,r:"20"}},alts:[{id:"a1",names:{IT:"Squat Sumo",EN:"Sumo Squat",ES:"Sentadilla sumo"}},{id:"a2",names:{IT:"Squat con pausa",EN:"Pause Squat",ES:"Sentadilla con pausa"}},{id:"a3",names:{IT:"Squat pulsante",EN:"Pulse Squat",ES:"Sentadilla pulsada"}}]},
    {id:"lunges",names:{IT:"Affondi alternati",EN:"Alternating Lunges",ES:"Zancadas alternadas"},timer:55,levels:{beginner:{s:2,r:"8/gamba"},intermediate:{s:3,r:"12/gamba"},hard:{s:4,r:"15/gamba"}},alts:[{id:"a1",names:{IT:"Affondo statico",EN:"Static Lunge",ES:"Zancada estática"}},{id:"a2",names:{IT:"Affondo inverso",EN:"Reverse Lunge",ES:"Zancada inversa"}},{id:"a3",names:{IT:"Affondo laterale",EN:"Side Lunge",ES:"Zancada lateral"}}]},
    {id:"bridge",names:{IT:"Ponte glutei",EN:"Glute Bridge",ES:"Puente de glúteos"},timer:45,levels:{beginner:{s:2,r:"15"},intermediate:{s:3,r:"20"},hard:{s:4,r:"25"}},alts:[{id:"a1",names:{IT:"Ponte su una gamba",EN:"Single-leg Bridge",ES:"Puente a una pierna"}},{id:"a2",names:{IT:"Ponte con pausa",EN:"Pause Bridge",ES:"Puente con pausa"}},{id:"a3",names:{IT:"Ponte con marcia",EN:"Marching Bridge",ES:"Puente marchando"}}]},
    {id:"wallsit",names:{IT:"Wall Sit",EN:"Wall Sit",ES:"Sentadilla en pared"},timer:40,levels:{beginner:{s:2,r:"20 sec"},intermediate:{s:3,r:"40 sec"},hard:{s:4,r:"60 sec"}},alts:[{id:"a1",names:{IT:"Wall Sit + alzate talloni",EN:"Wall Sit + calf raise",ES:"Sentadilla pared + talones"}},{id:"a2",names:{IT:"Squat isometrico",EN:"Isometric Squat",ES:"Sentadilla isométrica"}},{id:"a3",names:{IT:"Chair pose (yoga)",EN:"Chair pose (yoga)",ES:"Postura silla (yoga)"}}]},
    {id:"deadbug",names:{IT:"Dead Bug",EN:"Dead Bug",ES:"Bicho muerto"},timer:45,levels:{beginner:{s:2,r:"6/lato"},intermediate:{s:3,r:"10/lato"},hard:{s:4,r:"14/lato"}},alts:[{id:"a1",names:{IT:"Dead Bug solo braccia",EN:"Dead Bug arms only",ES:"Bicho muerto solo brazos"}},{id:"a2",names:{IT:"Dead Bug solo gambe",EN:"Dead Bug legs only",ES:"Bicho muerto solo piernas"}},{id:"a3",names:{IT:"Hollow Hold",EN:"Hollow Hold",ES:"Hollow Hold"}}]},
    {id:"str_mon",names:{IT:"Stretching finale",EN:"Cool-down Stretch",ES:"Estiramiento final"},timer:420,levels:{beginner:{s:1,r:"5 min"},intermediate:{s:1,r:"7 min"},hard:{s:1,r:"8 min"}},alts:[{id:"a1",names:{IT:"Stretch flessori anca",EN:"Hip flexor stretch",ES:"Estiramiento flexores"}},{id:"a2",names:{IT:"Stretch quadricipiti",EN:"Quad stretch",ES:"Estiramiento cuádriceps"}},{id:"a3",names:{IT:"Stretch polpacci",EN:"Calf stretch",ES:"Estiramiento gemelos"}}]},
  ],
  wednesday:[
    {id:"wu_wed",names:{IT:"Riscaldamento",EN:"Warm-up",ES:"Calentamiento"},timer:360,levels:{beginner:{s:1,r:"5 min"},intermediate:{s:1,r:"7 min"},hard:{s:1,r:"8 min"}},alts:[{id:"a1",names:{IT:"Cerchi braccia",EN:"Arm circles",ES:"Círculos de brazos"}},{id:"a2",names:{IT:"Rotazione busto",EN:"Torso twists",ES:"Giros de torso"}},{id:"a3",names:{IT:"Swing braccia",EN:"Arm swings",ES:"Balanceo de brazos"}}]},
    {id:"pushup",names:{IT:"Flessioni",EN:"Push-ups",ES:"Flexiones"},timer:40,levels:{beginner:{s:2,r:"8"},intermediate:{s:3,r:"12"},hard:{s:4,r:"16"}},alts:[{id:"a1",names:{IT:"Flessioni sulle ginocchia",EN:"Knee push-ups",ES:"Flexiones en rodillas"}},{id:"a2",names:{IT:"Flessioni inclinate (muro)",EN:"Incline push-ups",ES:"Flexiones inclinadas"}},{id:"a3",names:{IT:"Flessioni a diamante",EN:"Diamond push-ups",ES:"Flexiones diamante"}}]},
    {id:"widepush",names:{IT:"Flessioni larghe",EN:"Wide Push-ups",ES:"Flexiones abiertas"},timer:40,levels:{beginner:{s:2,r:"6"},intermediate:{s:3,r:"10"},hard:{s:4,r:"14"}},alts:[{id:"a1",names:{IT:"Dip su sedia",EN:"Chair dip",ES:"Dip en silla"}},{id:"a2",names:{IT:"Flessione lenta 5 sec",EN:"Slow push-up (5 sec)",ES:"Flexión lenta 5 seg"}},{id:"a3",names:{IT:"Flessione con camminata",EN:"Push-up walk-out",ES:"Flexión con desplazamiento"}}]},
    {id:"pike",names:{IT:"Pike Push-up",EN:"Pike Push-up",ES:"Flexión en pica"},timer:40,levels:{beginner:{s:2,r:"6"},intermediate:{s:3,r:"10"},hard:{s:4,r:"14"}},alts:[{id:"a1",names:{IT:"Shoulder tap",EN:"Shoulder tap",ES:"Toque de hombro"}},{id:"a2",names:{IT:"Down-Dog push-up",EN:"Downward dog push-up",ES:"Flexión perro boca abajo"}},{id:"a3",names:{IT:"Plank verticale muro",EN:"Wall plank hold",ES:"Plancha vertical pared"}}]},
    {id:"plank",names:{IT:"Plank sui gomiti",EN:"Elbow Plank",ES:"Plancha en codos"},timer:30,levels:{beginner:{s:2,r:"20 sec"},intermediate:{s:3,r:"35 sec"},hard:{s:4,r:"50 sec"}},alts:[{id:"a1",names:{IT:"Plank sulle mani",EN:"High plank",ES:"Plancha alta"}},{id:"a2",names:{IT:"Plank sulle ginocchia",EN:"Knee plank",ES:"Plancha en rodillas"}},{id:"a3",names:{IT:"Plank con reach",EN:"Plank reach",ES:"Plancha con alcance"}}]},
    {id:"sideplank",names:{IT:"Side Plank",EN:"Side Plank",ES:"Plancha lateral"},timer:20,levels:{beginner:{s:2,r:"15 sec/lato"},intermediate:{s:3,r:"22 sec/lato"},hard:{s:4,r:"35 sec/lato"}},alts:[{id:"a1",names:{IT:"Side Plank sulle ginocchia",EN:"Knee side plank",ES:"Plancha lateral en rodillas"}},{id:"a2",names:{IT:"Side Plank con alzata",EN:"Side plank hip raise",ES:"Plancha lateral con elevación"}},{id:"a3",names:{IT:"Ponte laterale",EN:"Lateral bridge",ES:"Puente lateral"}}]},
    {id:"birddog",names:{IT:"Bird-Dog",EN:"Bird-Dog",ES:"Perro-pájaro"},timer:45,levels:{beginner:{s:2,r:"6/lato"},intermediate:{s:3,r:"10/lato"},hard:{s:4,r:"14/lato"}},alts:[{id:"a1",names:{IT:"Bird-Dog lento (3 sec)",EN:"Slow Bird-Dog (3 sec)",ES:"Perro-pájaro lento"}},{id:"a2",names:{IT:"Donkey kick",EN:"Donkey kick",ES:"Patada de burro"}},{id:"a3",names:{IT:"Reach quadrupedico",EN:"Quadruped reach",ES:"Alcance en cuadrupedia"}}]},
    {id:"str_wed",names:{IT:"Stretching finale",EN:"Cool-down Stretch",ES:"Estiramiento final"},timer:420,levels:{beginner:{s:1,r:"5 min"},intermediate:{s:1,r:"7 min"},hard:{s:1,r:"8 min"}},alts:[{id:"a1",names:{IT:"Stretch petto",EN:"Chest stretch",ES:"Estiramiento de pecho"}},{id:"a2",names:{IT:"Stretch spalle",EN:"Shoulder stretch",ES:"Estiramiento de hombros"}},{id:"a3",names:{IT:"Stretch tricipiti",EN:"Tricep stretch",ES:"Estiramiento de tríceps"}}]},
  ],
  thursday:[
    {id:"wu_thu",names:{IT:"Riscaldamento",EN:"Warm-up",ES:"Calentamiento"},timer:300,levels:{beginner:{s:1,r:"5 min"},intermediate:{s:1,r:"5 min"},hard:{s:1,r:"5 min"}},alts:[{id:"a1",names:{IT:"Marcia lenta",EN:"Slow march",ES:"Marcha lenta"}},{id:"a2",names:{IT:"Mobilità articolare",EN:"Joint mobility",ES:"Movilidad articular"}},{id:"a3",names:{IT:"Skip leggero",EN:"Light skip",ES:"Skip ligero"}}]},
    {id:"march",names:{IT:"Marcia/Corsa sul posto",EN:"March/Jog in place",ES:"Marcha/Trote en el sitio"},timer:600,levels:{beginner:{s:1,r:"8 min"},intermediate:{s:1,r:"10 min"},hard:{s:1,r:"12 min"}},alts:[{id:"a1",names:{IT:"High Knees",EN:"High Knees",ES:"Rodillas altas"}},{id:"a2",names:{IT:"Butt Kicks",EN:"Butt Kicks",ES:"Talones al glúteo"}},{id:"a3",names:{IT:"Passo laterale veloce",EN:"Fast side step",ES:"Paso lateral rápido"}}]},
    {id:"stepup",names:{IT:"Step-Up su gradino",EN:"Step-Up",ES:"Subida al escalón"},timer:50,levels:{beginner:{s:2,r:"10/gamba"},intermediate:{s:3,r:"15/gamba"},hard:{s:4,r:"20/gamba"}},alts:[{id:"a1",names:{IT:"Step-Up con ginocchio",EN:"Step-Up with knee drive",ES:"Subida con rodilla"}},{id:"a2",names:{IT:"Tap sul gradino",EN:"Box tap",ES:"Toque al cajón"}},{id:"a3",names:{IT:"Step laterale",EN:"Lateral step-up",ES:"Subida lateral"}}]},
    {id:"jack",names:{IT:"Jumping Jack basso impatto",EN:"Low-impact Jumping Jack",ES:"Jumping Jack bajo impacto"},timer:30,levels:{beginner:{s:2,r:"20 sec"},intermediate:{s:3,r:"30 sec"},hard:{s:4,r:"45 sec"}},alts:[{id:"a1",names:{IT:"Step Jack",EN:"Step Jack",ES:"Step Jack"}},{id:"a2",names:{IT:"Jack solo braccia",EN:"Arms-only Jack",ES:"Jack solo brazos"}},{id:"a3",names:{IT:"Squat Jack",EN:"Squat Jack",ES:"Sentadilla Jack"}}]},
    {id:"sqtwist",names:{IT:"Squat + torsione busto",EN:"Squat + Torso Twist",ES:"Sentadilla + giro de torso"},timer:40,levels:{beginner:{s:2,r:"8"},intermediate:{s:3,r:"12"},hard:{s:4,r:"16"}},alts:[{id:"a1",names:{IT:"Wood Chop",EN:"Wood Chop",ES:"Leñador"}},{id:"a2",names:{IT:"Rotazione in piedi",EN:"Standing rotation",ES:"Rotación de pie"}},{id:"a3",names:{IT:"Squat + pugno",EN:"Squat + punch",ES:"Sentadilla + golpe"}}]},
    {id:"cd_thu",names:{IT:"Defaticamento",EN:"Cool-down",ES:"Enfriamiento"},timer:300,levels:{beginner:{s:1,r:"5 min"},intermediate:{s:1,r:"5 min"},hard:{s:1,r:"5 min"}},alts:[{id:"a1",names:{IT:"Marcia lenta",EN:"Slow march",ES:"Marcha lenta"}},{id:"a2",names:{IT:"Respiro profondo",EN:"Deep breathing",ES:"Respiración profunda"}},{id:"a3",names:{IT:"Passeggiata leggera",EN:"Gentle walk",ES:"Caminata suave"}}]},
    {id:"str_thu",names:{IT:"Stretching globale",EN:"Full body stretch",ES:"Estiramiento global"},timer:480,levels:{beginner:{s:1,r:"7 min"},intermediate:{s:1,r:"8 min"},hard:{s:1,r:"10 min"}},alts:[{id:"a1",names:{IT:"Stretch gambe",EN:"Leg stretch",ES:"Estiramiento de piernas"}},{id:"a2",names:{IT:"Flow yoga leggero",EN:"Light yoga flow",ES:"Flujo de yoga ligero"}},{id:"a3",names:{IT:"Auto-massaggio gambe",EN:"Leg self-massage",ES:"Automasaje de piernas"}}]},
  ],
  saturday:[
    {id:"wu_sat",names:{IT:"Riscaldamento dinamico",EN:"Dynamic Warm-up",ES:"Calentamiento dinámico"},timer:420,levels:{beginner:{s:1,r:"5 min"},intermediate:{s:1,r:"7 min"},hard:{s:1,r:"8 min"}},alts:[{id:"a1",names:{IT:"Affondi camminati",EN:"Walking lunges",ES:"Zancadas caminando"}},{id:"a2",names:{IT:"Oscillazioni gambe",EN:"Leg swings",ES:"Balanceos de piernas"}},{id:"a3",names:{IT:"Saltelli piccoli",EN:"Small jumps",ES:"Saltitos pequeños"}}]},
    {id:"sqpress",names:{IT:"Squat + Press aereo",EN:"Squat + Overhead Press",ES:"Sentadilla + press aéreo"},timer:45,levels:{beginner:{s:2,r:"10"},intermediate:{s:3,r:"15"},hard:{s:4,r:"20"}},alts:[{id:"a1",names:{IT:"Squat + reach",EN:"Squat + reach",ES:"Sentadilla + alcance"}},{id:"a2",names:{IT:"Thruster con bottiglie",EN:"Thruster (bottles)",ES:"Thruster con botellas"}},{id:"a3",names:{IT:"Squat + alzate laterali",EN:"Squat + lateral raise",ES:"Sentadilla + elevaciones"}}]},
    {id:"pushrot",names:{IT:"Flessioni + rotazione busto",EN:"Push-up + T-rotation",ES:"Flexión + rotación T"},timer:40,levels:{beginner:{s:2,r:"6"},intermediate:{s:3,r:"10"},hard:{s:4,r:"14"}},alts:[{id:"a1",names:{IT:"Spiderman push-up",EN:"Spiderman push-up",ES:"Flexión Spiderman"}},{id:"a2",names:{IT:"Flessione arciere",EN:"Archer push-up",ES:"Flexión arquero"}},{id:"a3",names:{IT:"Push-up renegade",EN:"Renegade push-up",ES:"Flexión renegada"}}]},
    {id:"sidelunge",names:{IT:"Affondi laterali",EN:"Side Lunges",ES:"Zancadas laterales"},timer:50,levels:{beginner:{s:2,r:"8/lato"},intermediate:{s:3,r:"12/lato"},hard:{s:4,r:"16/lato"}},alts:[{id:"a1",names:{IT:"Curtsy lunge",EN:"Curtsy lunge",ES:"Zancada cortesía"}},{id:"a2",names:{IT:"Skater",EN:"Skater",ES:"Patinador"}},{id:"a3",names:{IT:"Squat laterale",EN:"Lateral squat",ES:"Sentadilla lateral"}}]},
    {id:"bridgep",names:{IT:"Ponte glutei con pausa",EN:"Pause Glute Bridge",ES:"Puente glúteos con pausa"},timer:45,levels:{beginner:{s:2,r:"12"},intermediate:{s:3,r:"15"},hard:{s:4,r:"20"}},alts:[{id:"a1",names:{IT:"Ponte mono-gamba",EN:"Single-leg bridge",ES:"Puente a una pierna"}},{id:"a2",names:{IT:"Hip thrust a terra",EN:"Floor hip thrust",ES:"Empuje de cadera en suelo"}},{id:"a3",names:{IT:"Ponte a rana",EN:"Frog bridge",ES:"Puente rana"}}]},
    {id:"dynplank",names:{IT:"Plank dinamico",EN:"Dynamic Plank",ES:"Plancha dinámica"},timer:25,levels:{beginner:{s:2,r:"15 sec"},intermediate:{s:3,r:"22 sec"},hard:{s:4,r:"35 sec"}},alts:[{id:"a1",names:{IT:"Plank shoulder tap",EN:"Plank shoulder tap",ES:"Plancha toque de hombro"}},{id:"a2",names:{IT:"Plank hip dip",EN:"Plank hip dip",ES:"Plancha con caída de cadera"}},{id:"a3",names:{IT:"Mountain Climber lento",EN:"Slow Mountain Climber",ES:"Escalador lento"}}]},
    {id:"cardiofinish",names:{IT:"Cardio finale: Step-up",EN:"Cardio Finisher: Step-up",ES:"Cardio final: Subida escalón"},timer:300,levels:{beginner:{s:1,r:"4 min"},intermediate:{s:1,r:"5 min"},hard:{s:1,r:"6 min"}},alts:[{id:"a1",names:{IT:"Marcia veloce",EN:"Fast march",ES:"Marcha rápida"}},{id:"a2",names:{IT:"Box step",EN:"Box step",ES:"Paso en cajón"}},{id:"a3",names:{IT:"Shadow boxing",EN:"Shadow boxing",ES:"Boxeo en sombra"}}]},
    {id:"str_sat",names:{IT:"Stretching completo",EN:"Full stretch",ES:"Estiramiento completo"},timer:480,levels:{beginner:{s:1,r:"7 min"},intermediate:{s:1,r:"8 min"},hard:{s:1,r:"10 min"}},alts:[{id:"a1",names:{IT:"Tutto il corpo",EN:"Full body",ES:"Cuerpo completo"}},{id:"a2",names:{IT:"Yin yoga leggero",EN:"Light yin yoga",ES:"Yin yoga ligero"}},{id:"a3",names:{IT:"Rilassamento progressivo",EN:"Progressive relaxation",ES:"Relajación progresiva"}}]},
  ],
};

const REST_DAYS=["tuesday","friday","sunday"];
const DAY_ORDER=["monday","tuesday","wednesday","thursday","friday","saturday","sunday"];
const PALETTE={
  monday:{from:"#1e3a8a",to:"#1d4ed8",accent:"#3b82f6",light:"rgba(59,130,246,0.1)",border:"rgba(59,130,246,0.25)",tag:"#1d4ed8"},
  wednesday:{from:"#312e81",to:"#4f46e5",accent:"#818cf8",light:"rgba(129,140,248,0.1)",border:"rgba(129,140,248,0.25)",tag:"#4f46e5"},
  thursday:{from:"#064e3b",to:"#059669",accent:"#34d399",light:"rgba(52,211,153,0.1)",border:"rgba(52,211,153,0.25)",tag:"#059669"},
  saturday:{from:"#7c2d12",to:"#ea580c",accent:"#fb923c",light:"rgba(251,146,60,0.1)",border:"rgba(251,146,60,0.25)",tag:"#ea580c"},
  rest:{from:"#1e293b",to:"#334155",accent:"#64748b",light:"rgba(100,116,139,0.1)",border:"rgba(100,116,139,0.2)",tag:"#334155"},
};

function RingTimer({totalSeconds,accent,tr}){
  const[left,setLeft]=useState(totalSeconds);const[running,setRunning]=useState(false);const ref=useRef(null);
  useEffect(()=>{setLeft(totalSeconds);setRunning(false);clearInterval(ref.current);},[totalSeconds]);
  useEffect(()=>{if(running){ref.current=setInterval(()=>setLeft(t=>{if(t<=1){clearInterval(ref.current);setRunning(false);return 0;}return t-1;}),1000);}else clearInterval(ref.current);return()=>clearInterval(ref.current);},[running]);
  const R=28,C=2*Math.PI*R,progress=(totalSeconds-left)/totalSeconds,mins=Math.floor(left/60),secs=left%60,done=left===0;
  return(
    <div style={{background:"#020617",borderRadius:12,padding:"12px 14px",marginTop:10}}>
      <div style={{display:"flex",alignItems:"center",gap:14}}>
        <svg width={70} height={70} style={{flexShrink:0}}>
          <circle cx={35} cy={35} r={R} fill="none" stroke="#1e293b" strokeWidth={5}/>
          <circle cx={35} cy={35} r={R} fill="none" stroke={done?"#22c55e":accent} strokeWidth={5} strokeLinecap="round" strokeDasharray={C} strokeDashoffset={C*(1-progress)} transform="rotate(-90 35 35)" style={{transition:"stroke-dashoffset 0.9s linear"}}/>
          <text x={35} y={40} textAnchor="middle" style={{fill:done?"#22c55e":"#f1f5f9",fontSize:13,fontWeight:700,fontFamily:"monospace"}}>{done?"✓":`${String(mins).padStart(2,"0")}:${String(secs).padStart(2,"0")}`}</text>
        </svg>
        <div style={{flex:1}}>
          <div style={{color:"#475569",fontSize:11,textTransform:"uppercase",letterSpacing:"0.06em",marginBottom:7}}>{tr.timerLabel}</div>
          <div style={{display:"flex",gap:8}}>
            <button onClick={()=>!done&&setRunning(r=>!r)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",cursor:done?"default":"pointer",background:done?"#14532d":running?"#92400e":"#14532d",color:"#fff",fontWeight:700,fontSize:13,display:"flex",alignItems:"center",justifyContent:"center",gap:5}}>
              {done?"✓":running?<><Pause size={13}/>{tr.pause}</>:<><Play size={13}/>{tr.start}</>}
            </button>
            <button onClick={()=>{setLeft(totalSeconds);setRunning(false);}} style={{padding:"9px 12px",borderRadius:10,border:"none",cursor:"pointer",background:"#1e293b",color:"#64748b",display:"flex",alignItems:"center"}}><RotateCcw size={14}/></button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AltSheet({exercise,lang,selected,onSelect,onClose,accent}){
  const tr=TR[lang];
  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:200}}/>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#0f172a",borderRadius:"20px 20px 0 0",zIndex:201,paddingBottom:40,boxShadow:"0 -8px 40px rgba(0,0,0,0.6)"}}>
        <div style={{padding:"14px 20px 10px",borderBottom:"1px solid #1e293b",textAlign:"center"}}>
          <div style={{width:36,height:4,background:"#334155",borderRadius:2,margin:"0 auto 12px"}}/>
          <div style={{color:"#64748b",fontSize:11,textTransform:"uppercase",letterSpacing:"0.08em"}}>{tr.altLabel}</div>
        </div>
        <div style={{overflowY:"auto",maxHeight:"55vh"}}>
          <button onClick={()=>{onSelect(-1);onClose();}} style={{width:"100%",textAlign:"left",padding:"14px 20px",border:"none",cursor:"pointer",background:selected===-1?"rgba(59,130,246,0.12)":"transparent",display:"flex",alignItems:"center",gap:14}}>
            <div style={{width:52,height:42,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#1e293b",borderRadius:10,overflow:"hidden"}}><ExSVG type={EX_SVG_TYPE[exercise.id]} color={accent} size={52}/></div>
            <div style={{flex:1}}><div style={{color:selected===-1?accent:"#f1f5f9",fontWeight:selected===-1?700:500,fontSize:14}}>{exercise.names[lang]}</div><div style={{color:"#475569",fontSize:11,marginTop:2}}>{tr.mainExercise}</div></div>
            {selected===-1&&<span style={{color:accent,fontSize:16}}>✓</span>}
          </button>
          {exercise.alts.map((a,i)=>(
            <button key={a.id} onClick={()=>{onSelect(i);onClose();}} style={{width:"100%",textAlign:"left",padding:"14px 20px",border:"none",cursor:"pointer",borderTop:"1px solid #1e293b",background:selected===i?"rgba(59,130,246,0.12)":"transparent",display:"flex",alignItems:"center",gap:14}}>
              <div style={{width:52,height:42,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",background:"#1e293b",borderRadius:10,overflow:"hidden"}}><ExSVG type={EX_SVG_TYPE[exercise.id]} color={selected===i?accent:"#475569"} size={52}/></div>
              <div style={{flex:1}}><div style={{color:selected===i?accent:"#94a3b8",fontWeight:selected===i?700:400,fontSize:14}}>{a.names[lang]}</div></div>
              {selected===i&&<span style={{color:accent,fontSize:16}}>✓</span>}
            </button>
          ))}
        </div>
      </div>
    </>
  );
}

function ExerciseCard({ex,level,lang,pal,idx}){
  const[selAlt,setSelAlt]=useState(-1);const[sheetOpen,setSheetOpen]=useState(false);const[timerOpen,setTimerOpen]=useState(false);
  const tr=TR[lang],lv=ex.levels[level],name=selAlt===-1?ex.names[lang]:ex.alts[selAlt].names[lang];
  return(
    <>
      <div style={{borderRadius:16,border:`1px solid ${pal.border}`,overflow:"hidden",marginBottom:12,background:"#0f172a"}}>
        <div style={{background:pal.light,padding:"13px 14px 12px"}}>
          <div style={{display:"flex",alignItems:"flex-start",gap:10}}>
            <div style={{width:64,height:52,flexShrink:0,background:"rgba(0,0,0,0.25)",borderRadius:12,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}><ExSVG type={EX_SVG_TYPE[ex.id]} color={pal.accent}/></div>
            <div style={{flex:1,minWidth:0}}>
              <div style={{color:"#f1f5f9",fontWeight:700,fontSize:15,lineHeight:1.25}}>{name}</div>
              <div style={{display:"flex",gap:12,marginTop:4,flexWrap:"wrap"}}>
                {lv.s>1&&<span style={{color:"#64748b",fontSize:12}}>{tr.series}: <b style={{color:pal.accent}}>{lv.s}</b></span>}
                <span style={{color:"#64748b",fontSize:12}}>{tr.reps}: <b style={{color:pal.accent}}>{lv.r}</b></span>
              </div>
            </div>
            <div style={{width:26,height:26,borderRadius:8,background:pal.tag,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",color:"#fff",fontWeight:800,fontSize:12}}>{idx+1}</div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:12}}>
            <button onClick={()=>setSheetOpen(true)} style={{flex:1,padding:"9px 12px",borderRadius:10,border:`1px solid ${pal.border}`,cursor:"pointer",background:"rgba(0,0,0,0.2)",color:"#94a3b8",fontSize:12,textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:"85%"}}>{selAlt===-1?tr.altLabel:ex.alts[selAlt].names[lang]}</span>
              <span style={{color:"#475569",flexShrink:0}}>▾</span>
            </button>
            <button onClick={()=>setTimerOpen(o=>!o)} style={{padding:"9px 14px",borderRadius:10,border:"none",cursor:"pointer",background:timerOpen?pal.tag:"rgba(0,0,0,0.25)",color:timerOpen?"#fff":"#64748b",fontSize:15,flexShrink:0}}>⏱</button>
          </div>
          {timerOpen&&<RingTimer totalSeconds={ex.timer} accent={pal.accent} tr={tr}/>}
        </div>
      </div>
      {sheetOpen&&<AltSheet exercise={ex} lang={lang} selected={selAlt} onSelect={setSelAlt} onClose={()=>setSheetOpen(false)} accent={pal.accent}/>}
    </>
  );
}

// ─── DESCRIPTION POPUP ────────────────────────────────────────────────────────
function DescPopup({ex,lang,level,pal,onClose}){
  const tr=TR[lang],lv=ex.levels[level],svgType=EX_SVG_TYPE[ex.id]||"warmup",desc=DESCRIPTIONS[ex.id]?.[lang]||"";
  return(
    <>
      <div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.75)",zIndex:300}}/>
      <div style={{position:"fixed",bottom:0,left:0,right:0,background:"#0f172a",borderRadius:"22px 22px 0 0",zIndex:301,paddingBottom:40,maxHeight:"80vh",overflow:"hidden",display:"flex",flexDirection:"column",boxShadow:"0 -12px 50px rgba(0,0,0,0.7)"}}>
        {/* Drag handle + close */}
        <div style={{padding:"14px 20px 0",flexShrink:0}}>
          <div style={{width:36,height:4,background:"#334155",borderRadius:2,margin:"0 auto 14px"}}/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div style={{width:48,height:40,background:pal.light,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}><ExSVG type={svgType} color={pal.accent} size={48}/></div>
            <button onClick={onClose} style={{background:"#1e293b",border:"none",borderRadius:10,padding:"8px 10px",cursor:"pointer",color:"#64748b",display:"flex"}}><X size={18}/></button>
          </div>
        </div>
        {/* Scrollable content */}
        <div style={{overflowY:"auto",padding:"14px 20px 0",flex:1}}>
          <h2 style={{color:"#f1f5f9",fontSize:20,fontWeight:800,marginBottom:6,lineHeight:1.2}}>{ex.names[lang]}</h2>
          {/* Level chips */}
          <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
            <span style={{background:pal.light,color:pal.accent,borderRadius:20,padding:"4px 12px",fontSize:12,fontWeight:700,border:`1px solid ${pal.border}`}}>
              {lv.s>1?`${lv.s} × `:""}{lv.r}
            </span>
            <span style={{background:"#1e293b",color:"#64748b",borderRadius:20,padding:"4px 12px",fontSize:12}}>
              ⏱ {Math.floor(ex.timer/60)>0?`${Math.floor(ex.timer/60)}′`:`${ex.timer}″`}
            </span>
            <span style={{background:"#1e293b",color:"#64748b",borderRadius:20,padding:"4px 12px",fontSize:12}}>
              {ex.alts.length} {tr.alternatives}
            </span>
          </div>
          {/* Big illustration */}
          <div style={{background:pal.light,borderRadius:16,padding:"20px 0 16px",display:"flex",justifyContent:"center",marginBottom:16,border:`1px solid ${pal.border}`}}>
            <ExSVG type={svgType} color={pal.accent} size={130}/>
          </div>
          {/* Description */}
          <p style={{color:"#94a3b8",fontSize:14,lineHeight:1.75,marginBottom:20}}>{desc}</p>
          {/* Alternatives list */}
          <div style={{background:"#0a0f1e",borderRadius:14,padding:"12px 14px",border:"1px solid #1e293b",marginBottom:8}}>
            <div style={{color:"#475569",fontSize:11,textTransform:"uppercase",letterSpacing:"0.07em",marginBottom:10,fontWeight:600}}>{tr.alternatives}</div>
            {ex.alts.map((a,i)=>(
              <div key={a.id} style={{display:"flex",alignItems:"center",gap:10,padding:"8px 0",borderTop:i>0?"1px solid #1e293b":"none"}}>
                <div style={{width:24,height:24,borderRadius:6,background:pal.light,display:"flex",alignItems:"center",justifyContent:"center",color:pal.accent,fontSize:11,fontWeight:700,flexShrink:0}}>{i+1}</div>
                <span style={{color:"#94a3b8",fontSize:13}}>{a.names[lang]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ─── LIBRARY ──────────────────────────────────────────────────────────────────
function LibraryView({lang,level,onClose}){
  const[popup,setPopup]=useState(null);
  const tr=TR[lang],trainDays=["monday","wednesday","thursday","saturday"];
  return(
    <div style={{position:"fixed",inset:0,background:"#020617",zIndex:150,overflowY:"auto"}}>
      <div style={{background:"#0f172a",borderBottom:"1px solid #1e293b",padding:"40px 16px 14px",position:"sticky",top:0,zIndex:1,display:"flex",alignItems:"center",gap:12}}>
        <button onClick={onClose} style={{background:"#1e293b",border:"none",borderRadius:10,padding:"8px 10px",cursor:"pointer",color:"#94a3b8",display:"flex"}}><ArrowLeft size={20}/></button>
        <div>
          <h2 style={{color:"#f1f5f9",fontSize:18,fontWeight:800,margin:0}}>{tr.library}</h2>
          <div style={{color:"#475569",fontSize:11,marginTop:2,textTransform:"uppercase",letterSpacing:"0.06em"}}>
            {tr[level]} · {Object.values(DB).flat().length} {tr.allExercises}
          </div>
        </div>
        <div style={{marginLeft:"auto",background:"#1e293b",borderRadius:8,padding:"4px 8px",color:"#64748b",fontSize:11}}>
          <Info size={12} style={{display:"inline",marginRight:4,verticalAlign:"middle"}}/>tap per dettagli
        </div>
      </div>
      <div style={{padding:"16px 14px 60px"}}>
        {trainDays.map(day=>{
          const p=PALETTE[day],exercises=DB[day];
          return(
            <div key={day} style={{marginBottom:28}}>
              <div style={{background:`linear-gradient(90deg,${p.from},${p.to})`,borderRadius:12,padding:"10px 16px",marginBottom:10,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
                <span style={{color:"#fff",fontWeight:800,fontSize:15}}>{tr.days[day]}</span>
                <span style={{color:"rgba(255,255,255,0.55)",fontSize:11}}>{tr.dayType[day]}</span>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
                {exercises.map((ex,i)=>{
                  const svgType=EX_SVG_TYPE[ex.id]||"warmup",lv=ex.levels[level];
                  return(
                    <button key={ex.id} onClick={()=>setPopup({ex,pal:p})}
                      style={{background:"#0f172a",border:`1px solid ${p.border}`,borderRadius:14,padding:"12px 10px",display:"flex",flexDirection:"column",alignItems:"center",textAlign:"center",gap:6,cursor:"pointer",WebkitTapHighlightColor:"transparent"}}>
                      <div style={{width:70,height:56,background:p.light,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden"}}><ExSVG type={svgType} color={p.accent}/></div>
                      <div style={{color:"#e2e8f0",fontWeight:600,fontSize:12,lineHeight:1.3,minHeight:32,display:"flex",alignItems:"center"}}>{ex.names[lang]}</div>
                      <div style={{color:p.accent,fontSize:11,fontWeight:700,background:p.light,borderRadius:8,padding:"3px 10px"}}>{lv.s>1?`${lv.s}×`:""}{lv.r}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
      {popup&&<DescPopup ex={popup.ex} lang={lang} level={level} pal={popup.pal} onClose={()=>setPopup(null)}/>}
    </div>
  );
}

function Sidebar({open,onClose,day,setDay,level,setLevel,lang,setLang,onLibrary}){
  const tr=TR[lang];
  return(
    <>
      {open&&<div onClick={onClose} style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.65)",zIndex:40}}/>}
      <div style={{position:"fixed",top:0,left:0,height:"100%",width:280,background:"#020617",zIndex:50,transform:open?"translateX(0)":"translateX(-100%)",transition:"transform 0.28s cubic-bezier(.4,0,.2,1)",overflowY:"auto",borderRight:"1px solid #1e293b"}}>
        <div style={{padding:"20px 16px 40px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:24}}>
            <span style={{color:"#f1f5f9",fontWeight:800,fontSize:17}}>🏋️ {tr.appName}</span>
            <button onClick={onClose} style={{background:"#1e293b",border:"none",borderRadius:8,padding:7,cursor:"pointer",color:"#94a3b8"}}><X size={18}/></button>
          </div>
          <SL>{tr.language}</SL>
          <div style={{display:"flex",gap:6,marginBottom:20}}>{["IT","EN","ES"].map(l=><button key={l} onClick={()=>setLang(l)} style={{flex:1,padding:"9px 0",borderRadius:10,border:"none",cursor:"pointer",fontWeight:700,fontSize:13,background:lang===l?"#3b82f6":"#1e293b",color:lang===l?"#fff":"#64748b"}}>{l}</button>)}</div>
          <SL>{tr.level}</SL>
          <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:20}}>
            {[["beginner","🌱"],["intermediate","💪"],["hard","🔥"]].map(([lv,em])=><button key={lv} onClick={()=>setLevel(lv)} style={{padding:"10px 14px",borderRadius:10,border:"none",cursor:"pointer",textAlign:"left",fontWeight:600,fontSize:13,background:level===lv?"#1d4ed8":"#1e293b",color:level===lv?"#fff":"#64748b"}}>{em} {tr[lv]}</button>)}
          </div>
          <button onClick={()=>{onClose();onLibrary();}} style={{width:"100%",padding:"12px 14px",borderRadius:12,border:"1px solid #1e3a8a",cursor:"pointer",textAlign:"left",background:"rgba(29,78,216,0.15)",color:"#3b82f6",fontWeight:700,fontSize:13,marginBottom:20,display:"flex",alignItems:"center",gap:10}}>
            <BookOpen size={16}/> {tr.library}
          </button>
          <SL>{tr.selectDay}</SL>
          <div style={{display:"flex",flexDirection:"column",gap:5}}>
            {DAY_ORDER.map(d=>{const isR=REST_DAYS.includes(d),p=isR?PALETTE.rest:PALETTE[d]||PALETTE.monday,active=day===d;return(
              <button key={d} onClick={()=>{setDay(d);onClose();}} style={{padding:"10px 14px",borderRadius:10,border:active?`1px solid ${p.accent}`:"1px solid transparent",cursor:"pointer",textAlign:"left",display:"flex",justifyContent:"space-between",alignItems:"center",background:active?p.light:"#0f172a",color:active?p.accent:"#64748b",fontWeight:active?700:500,fontSize:13}}>
                <span>{tr.days[d]}</span>{isR&&<Moon size={12} style={{color:"#334155"}}/>}
              </button>
            );})}
          </div>
        </div>
      </div>
    </>
  );
}
function SL({children}){return <div style={{color:"#334155",fontSize:10,textTransform:"uppercase",letterSpacing:"0.1em",fontWeight:600,marginBottom:8}}>{children}</div>;}

export default function App(){
  const[sidebarOpen,setSidebarOpen]=useState(false);const[day,setDay]=useState("monday");const[level,setLevel]=useState("intermediate");const[lang,setLang]=useState("IT");const[libraryOpen,setLibraryOpen]=useState(false);
  const tr=TR[lang],isRest=REST_DAYS.includes(day),exercises=DB[day]||[],pal=isRest?PALETTE.rest:(PALETTE[day]||PALETTE.monday),lvIcon=level==="beginner"?"🌱":level==="intermediate"?"💪":"🔥";
  return(
    <div style={{minHeight:"100vh",background:"#020617",fontFamily:"-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif"}}>
      <Sidebar open={sidebarOpen} onClose={()=>setSidebarOpen(false)} day={day} setDay={setDay} level={level} setLevel={setLevel} lang={lang} setLang={setLang} onLibrary={()=>setLibraryOpen(true)}/>
      {libraryOpen&&<LibraryView lang={lang} level={level} onClose={()=>setLibraryOpen(false)}/>}
      <div style={{background:`linear-gradient(135deg,${pal.from},${pal.to})`,padding:"40px 16px 20px",position:"sticky",top:0,zIndex:30}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
          <button onClick={()=>setSidebarOpen(true)} style={{background:"rgba(255,255,255,0.15)",border:"none",borderRadius:10,padding:"8px 10px",cursor:"pointer",color:"#fff",display:"flex"}}><Menu size={20}/></button>
          <span style={{color:"rgba(255,255,255,0.9)",fontWeight:700,fontSize:16,flex:1}}>{tr.appName}</span>
          <div style={{display:"flex",gap:4}}>{["IT","EN","ES"].map(l=><button key={l} onClick={()=>setLang(l)} style={{padding:"4px 8px",borderRadius:7,border:"none",cursor:"pointer",fontSize:11,fontWeight:700,background:lang===l?"rgba(255,255,255,0.9)":"rgba(255,255,255,0.15)",color:lang===l?"#1e293b":"#fff"}}>{l}</button>)}</div>
        </div>
        <h1 style={{color:"#fff",fontSize:24,fontWeight:800,margin:0,lineHeight:1.1}}>{tr.days[day]}</h1>
        <p style={{color:"rgba(255,255,255,0.6)",fontSize:13,margin:"3px 0 8px"}}>{tr.dayType[day]}</p>
        <span style={{display:"inline-block",background:"rgba(0,0,0,0.25)",borderRadius:20,padding:"4px 12px",color:"#fff",fontSize:12,fontWeight:600}}>{lvIcon} {tr[level]}</span>
      </div>
      <div style={{padding:"14px 14px 60px"}}>
        {isRest?(
          <div style={{textAlign:"center",padding:"60px 20px"}}>
            <div style={{fontSize:60,marginBottom:16}}>😴</div>
            <h2 style={{color:"#f1f5f9",fontSize:20,fontWeight:700,marginBottom:10}}>{tr.restDay}</h2>
            <p style={{color:"#475569",fontSize:14,lineHeight:1.6,maxWidth:280,margin:"0 auto"}}>{tr.restDesc}</p>
          </div>
        ):(
          <>
            <div style={{background:"rgba(234,179,8,0.08)",border:"1px solid rgba(234,179,8,0.25)",borderRadius:12,padding:"9px 13px",marginBottom:14,color:"#fbbf24",fontSize:12}}>{tr.note}</div>
            {exercises.map((ex,i)=><ExerciseCard key={ex.id} ex={ex} level={level} lang={lang} pal={pal} idx={i}/>)}
          </>
        )}
      </div>
    </div>
  );
}
