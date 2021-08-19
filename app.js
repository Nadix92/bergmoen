const _container = document.getElementById('sdv-container');
const ticket =
  '81d2bd012e5a819dc0030113d3bac38404af0146677ebbdaa7fccaa801a44a8a7e1f8a34d19aef5929e6ae6750f6e12e4283b54f6ed81fa19c7be6e0cbf0c7e27a7098669dc90e486675990a16d5f56f594acdaf6801b75a34ec68bec95a3761c51a62d2ed7b02eac873a18faf918baad8b6165d4523b7aaf7032d977c43dd61-ff6e60d1f28f0e2ca99bc587543d7caa';

const _viewerSettings = {
  container: _container,
  api: {
    version: 2,
  },
  ticket,

  modelViewUrl: 'eu-central-1',
};

const api = new SDVApp.ParametricViewer(_viewerSettings);

let viewerInit = false;

//////////////////////////////////////
// Doom Elements
const applyBtn = document.getElementById('apply-btn');
const høyde = document.getElementById('hoyde');
const lengde = document.getElementById('lengde');

const minHøyde = document.getElementById('min-hoyde');
const maxHøyde = document.getElementById('max-hoyde');

const minLengde = document.getElementById('min-lengde');
const maxLengde = document.getElementById('max-lengde');

const skapDybde = document.querySelectorAll('input[type=radio][name="skap-dybde"]');
const plateTykkelse = document.querySelectorAll('input[type=radio][name="plate-tykkelse"]');
const dørBredde = document.querySelectorAll('input[type=radio][name="dor-bredde"]');

// const visHull = document.getElementById('vis-hull');
const visTrapp = document.getElementById('vis-trapp');
const visBakplate = document.getElementById('vis-bakplate');
const visDører = document.getElementById('vis-dør');
const visHengsler = document.getElementById('vis-hengsler');

api.scene.addEventListener(api.scene.EVENTTYPE.VISIBILITY_ON, function () {
  if (!viewerInit) {
    //////////////////////////////////////
    // For development purupses

    let parameters = api.parameters.get();
    console.log('Parameters Data:');
    console.log(parameters.data);

    let sceneData = api.scene.getData();
    console.log('Scene Data:');
    console.log(sceneData.data);

    const resExport = api.exports.get();
    console.log('Export Data');
    console.log(resExport.data);

    //////////////////////////////////////
    // Update Parameter
    const updateParameters = async (name, value) => {
      try {
        const response = await api.parameters.updateAsync({
          name,
          value,
        });

        // console.log(response);

        if (response.err) {
          errMsg = `${response.err.toString()} (${value} @ ${name})`;
          console.log(errMsg);
          alert(errMsg);
        }
      } catch (err) {
        console.log(err);
      }
    };

    skapDybde.forEach(radio =>
      radio.addEventListener('change', () => updateParameters('Skap Dybde', radio.value))
    );

    plateTykkelse.forEach(radio =>
      radio.addEventListener('change', () => updateParameters('Plate Tykkelse', radio.value))
    );

    dørBredde.forEach(radio =>
      radio.addEventListener('change', () => updateParameters('Dør Bredde', radio.value))
    );

    const setDefaultChoices = async () => {
      const loadDefVal = (paramName, elementName) => {
        const defualt = parameters.data.find(element => element.name === paramName);

        if (defualt.type === 'StringList') {
          elementName[defualt.defval].checked = true;
        } else if (defualt.type === 'Bool') {
          elementName.checked = defualt.defval;
        }
      };

      loadDefVal('Skap Dybde', skapDybde);
      loadDefVal('Plate Tykkelse', plateTykkelse);
      loadDefVal('Dør Bredde', dørBredde);

      loadDefVal('vis trapp', visTrapp);
      loadDefVal('vis bakplate', visBakplate);
      loadDefVal('vis dør', visDører);
      loadDefVal('vis hengsler', visHengsler);
      // loadDefVal('Vis Hull', visHull);
    };
    setDefaultChoices();

    const getMinMaxValue = () => {
      // Høyde value
      const filteredHøyde = parameters.data.find(element => element.name === 'Høyde');
      minHøyde.innerText = `${filteredHøyde.name} min value: ${filteredHøyde.min}`;
      maxHøyde.innerText = `${filteredHøyde.name} max value: ${filteredHøyde.max}`;

      minHøyde.style.color = 'inherit';
      maxHøyde.style.color = 'inherit';
      høyde.value = filteredHøyde.value;

      // Lengde value
      const filteredLengde = parameters.data.find(element => element.name === 'Lengde');
      minLengde.innerText = `${filteredLengde.name} min value: ${filteredLengde.min}`;
      maxLengde.innerText = `${filteredLengde.name} max value: ${filteredLengde.max}`;

      minLengde.style.color = 'inherit';
      maxLengde.style.color = 'inherit';
      lengde.value = filteredLengde.value;

      // document.getElementById(
      //   'current-hoyde'
      // ).innerText = `${filtered.name} default value on load: ${filtered.defval}`;
    };
    getMinMaxValue();

    applyBtn.addEventListener('click', async () => {
      await updateParameters('Lengde', lengde.value);
      await updateParameters('Høyde', høyde.value);
    });

    // visHull.addEventListener('change', () => updateParameters('Vis Hull', visHull.checked));
    visBakplate.addEventListener('change', () => updateParameters('vis bakplate', visBakplate.checked));
    visDører.addEventListener('change', () => updateParameters('vis dør', visDører.checked));
    visHengsler.addEventListener('change', () => updateParameters('vis hengsler', visHengsler.checked));
    visTrapp.addEventListener('change', () => updateParameters('vis trapp', visTrapp.checked));

    // This need to be Last on the code
    viewerInit = true;
  }
});
