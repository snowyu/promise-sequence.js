import arrFrom from './array-from';

if (!Array.from) {
  Array.from = arrFrom;
}
