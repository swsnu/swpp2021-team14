import EnzymeAdapter from 'enzyme-adapter-react-17-updated';
import Enzyme from 'enzyme';

Enzyme.configure({
    adapter: new EnzymeAdapter(),
    disableLifecycleMethods: true,
});
