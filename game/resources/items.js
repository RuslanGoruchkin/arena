import _ from 'lodash';


import {armors_bodies, interior_armors} from './armors';
import {weapons_bodies, interior_weapons} from './weapons';
import {shields_bodies} from './shields';

export const items = _.assign({}, armors_bodies, interior_armors, weapons_bodies, interior_weapons, shields_bodies);
