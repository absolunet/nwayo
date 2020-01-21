//--------------------------------------------------------
//-- Nwayo Core - Repositories - Build Type Repository Proxy
//--------------------------------------------------------

import __            from '@absolunet/private-registry';
import { BaseProxy } from '@absolunet/ioc';


/**
 * Build type repository proxy.
 *
 * @memberof nwayo.core.repositories
 * @augments ioc.support.proxy.BaseProxy
 */
class BuildTypeRepositoryProxy extends BaseProxy {

	/**
	 * @inheritdoc
	 */
	get(object, property) {
		if (property.toUpperCase() === property && !__(this).get('has')(object, property)) {
			return object.get(property);
		}

		return super.get(object, property);
	}

}


export default BuildTypeRepositoryProxy;
