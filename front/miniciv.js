let wasm;

const cachedTextDecoder = (typeof TextDecoder !== 'undefined' ? new TextDecoder('utf-8', { ignoreBOM: true, fatal: true }) : { decode: () => { throw Error('TextDecoder not available') } } );

if (typeof TextDecoder !== 'undefined') { cachedTextDecoder.decode(); };

let cachedUint8ArrayMemory0 = null;

function getUint8ArrayMemory0() {
    if (cachedUint8ArrayMemory0 === null || cachedUint8ArrayMemory0.byteLength === 0) {
        cachedUint8ArrayMemory0 = new Uint8Array(wasm.memory.buffer);
    }
    return cachedUint8ArrayMemory0;
}

function getStringFromWasm0(ptr, len) {
    ptr = ptr >>> 0;
    return cachedTextDecoder.decode(getUint8ArrayMemory0().subarray(ptr, ptr + len));
}

let WASM_VECTOR_LEN = 0;

const cachedTextEncoder = (typeof TextEncoder !== 'undefined' ? new TextEncoder('utf-8') : { encode: () => { throw Error('TextEncoder not available') } } );

const encodeString = (typeof cachedTextEncoder.encodeInto === 'function'
    ? function (arg, view) {
    return cachedTextEncoder.encodeInto(arg, view);
}
    : function (arg, view) {
    const buf = cachedTextEncoder.encode(arg);
    view.set(buf);
    return {
        read: arg.length,
        written: buf.length
    };
});

function passStringToWasm0(arg, malloc, realloc) {

    if (realloc === undefined) {
        const buf = cachedTextEncoder.encode(arg);
        const ptr = malloc(buf.length, 1) >>> 0;
        getUint8ArrayMemory0().subarray(ptr, ptr + buf.length).set(buf);
        WASM_VECTOR_LEN = buf.length;
        return ptr;
    }

    let len = arg.length;
    let ptr = malloc(len, 1) >>> 0;

    const mem = getUint8ArrayMemory0();

    let offset = 0;

    for (; offset < len; offset++) {
        const code = arg.charCodeAt(offset);
        if (code > 0x7F) break;
        mem[ptr + offset] = code;
    }

    if (offset !== len) {
        if (offset !== 0) {
            arg = arg.slice(offset);
        }
        ptr = realloc(ptr, len, len = offset + arg.length * 3, 1) >>> 0;
        const view = getUint8ArrayMemory0().subarray(ptr + offset, ptr + len);
        const ret = encodeString(arg, view);

        offset += ret.written;
        ptr = realloc(ptr, len, offset, 1) >>> 0;
    }

    WASM_VECTOR_LEN = offset;
    return ptr;
}

let cachedDataViewMemory0 = null;

function getDataViewMemory0() {
    if (cachedDataViewMemory0 === null || cachedDataViewMemory0.buffer.detached === true || (cachedDataViewMemory0.buffer.detached === undefined && cachedDataViewMemory0.buffer !== wasm.memory.buffer)) {
        cachedDataViewMemory0 = new DataView(wasm.memory.buffer);
    }
    return cachedDataViewMemory0;
}

function _assertClass(instance, klass) {
    if (!(instance instanceof klass)) {
        throw new Error(`expected instance of ${klass.name}`);
    }
}

export function greet() {
    wasm.greet();
}

export function setup() {
    wasm.setup();
}

const CellFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_cell_free(ptr >>> 0, 1));

export class Cell {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Cell.prototype);
        obj.__wbg_ptr = ptr;
        CellFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        CellFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_cell_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get id() {
        const ret = wasm.__wbg_get_cell_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set id(arg0) {
        wasm.__wbg_set_cell_id(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get diameter() {
        const ret = wasm.__wbg_get_cell_diameter(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set diameter(arg0) {
        wasm.__wbg_set_cell_diameter(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {Point}
     */
    get p() {
        const ret = wasm.__wbg_get_cell_p(this.__wbg_ptr);
        return Point.__wrap(ret);
    }
    /**
     * @param {Point} arg0
     */
    set p(arg0) {
        _assertClass(arg0, Point);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_cell_p(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Point}
     */
    get pp() {
        const ret = wasm.__wbg_get_cell_pp(this.__wbg_ptr);
        return Point.__wrap(ret);
    }
    /**
     * @param {Point} arg0
     */
    set pp(arg0) {
        _assertClass(arg0, Point);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_cell_pp(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Point}
     */
    get dp() {
        const ret = wasm.__wbg_get_cell_dp(this.__wbg_ptr);
        return Point.__wrap(ret);
    }
    /**
     * @param {Point} arg0
     */
    set dp(arg0) {
        _assertClass(arg0, Point);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_cell_dp(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {Point}
     */
    get dv() {
        const ret = wasm.__wbg_get_cell_dv(this.__wbg_ptr);
        return Point.__wrap(ret);
    }
    /**
     * @param {Point} arg0
     */
    set dv(arg0) {
        _assertClass(arg0, Point);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_cell_dv(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {number}
     */
    get mass() {
        const ret = wasm.__wbg_get_cell_mass(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set mass(arg0) {
        wasm.__wbg_set_cell_mass(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get area() {
        const ret = wasm.__wbg_get_cell_area(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set area(arg0) {
        wasm.__wbg_set_cell_area(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get growth() {
        const ret = wasm.__wbg_get_cell_growth(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set growth(arg0) {
        wasm.__wbg_set_cell_growth(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} id
     * @param {number} diameter
     * @param {number} growth
     * @returns {Cell}
     */
    static new(id, diameter, growth) {
        const ret = wasm.cell_new(id, diameter, growth);
        return Cell.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    static size() {
        const ret = wasm.cell_size();
        return ret >>> 0;
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    set_position(x, y) {
        wasm.cell_set_position(this.__wbg_ptr, x, y);
    }
}

const LinkFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_link_free(ptr >>> 0, 1));

export class Link {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Link.prototype);
        obj.__wbg_ptr = ptr;
        LinkFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        LinkFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_link_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get caid() {
        const ret = wasm.__wbg_get_link_caid(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set caid(arg0) {
        wasm.__wbg_set_link_caid(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get cbid() {
        const ret = wasm.__wbg_get_link_cbid(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set cbid(arg0) {
        wasm.__wbg_set_link_cbid(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get live() {
        const ret = wasm.__wbg_get_link_live(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set live(arg0) {
        wasm.__wbg_set_link_live(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} caid
     * @param {number} cbid
     * @returns {Link}
     */
    static new(caid, cbid) {
        const ret = wasm.link_new(caid, cbid);
        return Link.__wrap(ret);
    }
    /**
     * @returns {number}
     */
    static size() {
        const ret = wasm.link_size();
        return ret >>> 0;
    }
}

const PersonFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_person_free(ptr >>> 0, 1));

export class Person {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Person.prototype);
        obj.__wbg_ptr = ptr;
        PersonFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PersonFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_person_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get id() {
        const ret = wasm.__wbg_get_person_id(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} arg0
     */
    set id(arg0) {
        wasm.__wbg_set_person_id(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} id
     * @returns {Person}
     */
    static new(id) {
        const ret = wasm.person_new(id);
        return Person.__wrap(ret);
    }
}

const PointFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_point_free(ptr >>> 0, 1));

export class Point {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(Point.prototype);
        obj.__wbg_ptr = ptr;
        PointFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        PointFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_point_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    get x() {
        const ret = wasm.__wbg_get_point_x(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set x(arg0) {
        wasm.__wbg_set_point_x(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {number}
     */
    get y() {
        const ret = wasm.__wbg_get_point_y(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {number} arg0
     */
    set y(arg0) {
        wasm.__wbg_set_point_y(this.__wbg_ptr, arg0);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {Point}
     */
    static new(x, y) {
        const ret = wasm.point_new(x, y);
        return Point.__wrap(ret);
    }
    /**
     * @returns {Point}
     */
    normalize() {
        const ret = wasm.point_normalize(this.__wbg_ptr);
        return Point.__wrap(ret);
    }
    /**
     * @returns {Point}
     */
    normalized() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.point_normalized(ptr);
        return Point.__wrap(ret);
    }
    /**
     * @param {Point} b
     * @returns {number}
     */
    distance(b) {
        const ptr = this.__destroy_into_raw();
        _assertClass(b, Point);
        var ptr0 = b.__destroy_into_raw();
        const ret = wasm.point_distance(ptr, ptr0);
        return ret;
    }
    /**
     * @param {Point} b
     * @returns {number}
     */
    distance_squared_2(b) {
        const ptr = this.__destroy_into_raw();
        _assertClass(b, Point);
        var ptr0 = b.__destroy_into_raw();
        const ret = wasm.point_distance_squared_2(ptr, ptr0);
        return ret;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    distance_squared(x, y) {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.point_distance_squared(ptr, x, y);
        return ret;
    }
    /**
     * @returns {number}
     */
    length() {
        const ptr = this.__destroy_into_raw();
        const ret = wasm.point_length(ptr);
        return ret;
    }
}

const StepDurationsFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_stepdurations_free(ptr >>> 0, 1));

export class StepDurations {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(StepDurations.prototype);
        obj.__wbg_ptr = ptr;
        StepDurationsFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        StepDurationsFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_stepdurations_free(ptr, 0);
    }
    /**
     * @returns {bigint}
     */
    get update_cells_01() {
        const ret = wasm.__wbg_get_stepdurations_update_cells_01(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {bigint} arg0
     */
    set update_cells_01(arg0) {
        wasm.__wbg_set_stepdurations_update_cells_01(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get update_cells_02() {
        const ret = wasm.__wbg_get_stepdurations_update_cells_02(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {bigint} arg0
     */
    set update_cells_02(arg0) {
        wasm.__wbg_set_stepdurations_update_cells_02(this.__wbg_ptr, arg0);
    }
    /**
     * @returns {bigint}
     */
    get update_cells_03() {
        const ret = wasm.__wbg_get_stepdurations_update_cells_03(this.__wbg_ptr);
        return ret;
    }
    /**
     * @param {bigint} arg0
     */
    set update_cells_03(arg0) {
        wasm.__wbg_set_stepdurations_update_cells_03(this.__wbg_ptr, arg0);
    }
}

const TreeFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_tree_free(ptr >>> 0, 1));

export class Tree {

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        TreeFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_tree_free(ptr, 0);
    }
    /**
     * @returns {number}
     */
    static size() {
        const ret = wasm.tree_size();
        return ret >>> 0;
    }
}

const WorldFinalization = (typeof FinalizationRegistry === 'undefined')
    ? { register: () => {}, unregister: () => {} }
    : new FinalizationRegistry(ptr => wasm.__wbg_world_free(ptr >>> 0, 1));

export class World {

    static __wrap(ptr) {
        ptr = ptr >>> 0;
        const obj = Object.create(World.prototype);
        obj.__wbg_ptr = ptr;
        WorldFinalization.register(obj, obj.__wbg_ptr, obj);
        return obj;
    }

    __destroy_into_raw() {
        const ptr = this.__wbg_ptr;
        this.__wbg_ptr = 0;
        WorldFinalization.unregister(this);
        return ptr;
    }

    free() {
        const ptr = this.__destroy_into_raw();
        wasm.__wbg_world_free(ptr, 0);
    }
    /**
     * @returns {StepDurations}
     */
    get step_durations_avg() {
        const ret = wasm.__wbg_get_world_step_durations_avg(this.__wbg_ptr);
        return StepDurations.__wrap(ret);
    }
    /**
     * @param {StepDurations} arg0
     */
    set step_durations_avg(arg0) {
        _assertClass(arg0, StepDurations);
        var ptr0 = arg0.__destroy_into_raw();
        wasm.__wbg_set_world_step_durations_avg(this.__wbg_ptr, ptr0);
    }
    /**
     * @returns {World}
     */
    static new() {
        const ret = wasm.world_new();
        return World.__wrap(ret);
    }
    /**
     * @param {number} caid
     * @param {number} cbid
     */
    add_link(caid, cbid) {
        wasm.world_add_link(this.__wbg_ptr, caid, cbid);
    }
    /**
     * @param {number} caid
     * @param {number} cbid
     */
    remove_link(caid, cbid) {
        wasm.world_remove_link(this.__wbg_ptr, caid, cbid);
    }
    update_cells_01() {
        wasm.world_update_cells_01(this.__wbg_ptr);
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    find_cell(x, y) {
        const ret = wasm.world_find_cell(this.__wbg_ptr, x, y);
        return ret >>> 0;
    }
    update_cells_02() {
        wasm.world_update_cells_02(this.__wbg_ptr);
    }
    update_cells_03() {
        wasm.world_update_cells_03(this.__wbg_ptr);
    }
    step() {
        wasm.world_step(this.__wbg_ptr);
    }
    /**
     * @param {number} gravity
     */
    set_gravity(gravity) {
        wasm.world_set_gravity(this.__wbg_ptr, gravity);
    }
    /**
     * @param {number} spring
     */
    set_spring(spring) {
        wasm.world_set_spring(this.__wbg_ptr, spring);
    }
    /**
     * @param {number} rdv
     */
    set_rdv(rdv) {
        wasm.world_set_rdv(this.__wbg_ptr, rdv);
    }
    /**
     * @param {number} rdp
     */
    set_rdp(rdp) {
        wasm.world_set_rdp(this.__wbg_ptr, rdp);
    }
    /**
     * @param {number} crdv
     */
    set_crdv(crdv) {
        wasm.world_set_crdv(this.__wbg_ptr, crdv);
    }
    /**
     * @param {number} crdp
     */
    set_crdp(crdp) {
        wasm.world_set_crdp(this.__wbg_ptr, crdp);
    }
    /**
     * @param {number} min
     * @param {number} max
     * @returns {number}
     */
    rand_f32(min, max) {
        const ret = wasm.world_rand_f32(this.__wbg_ptr, min, max);
        return ret;
    }
    /**
     * @param {number} x
     * @param {number} y
     * @returns {number}
     */
    add_cell(x, y) {
        const ret = wasm.world_add_cell(this.__wbg_ptr, x, y);
        return ret >>> 0;
    }
    /**
     * @param {number} idx
     * @param {number} x
     */
    set_cell_position_x(idx, x) {
        wasm.world_set_cell_position_x(this.__wbg_ptr, idx, x);
    }
    /**
     * @param {number} idx
     * @param {number} y
     */
    set_cell_position_y(idx, y) {
        wasm.world_set_cell_position_y(this.__wbg_ptr, idx, y);
    }
    /**
     * @param {number} idx
     * @param {number} x
     */
    set_cell_pp_x(idx, x) {
        wasm.world_set_cell_pp_x(this.__wbg_ptr, idx, x);
    }
    /**
     * @param {number} idx
     * @param {number} y
     */
    set_cell_pp_y(idx, y) {
        wasm.world_set_cell_pp_y(this.__wbg_ptr, idx, y);
    }
    /**
     * @param {number} idx
     * @param {number} diameter
     */
    set_cell_diameter(idx, diameter) {
        wasm.world_set_cell_diameter(this.__wbg_ptr, idx, diameter);
    }
    /**
     * @param {number} idx
     * @returns {number}
     */
    get_cell_diameter(idx) {
        const ret = wasm.world_get_cell_diameter(this.__wbg_ptr, idx);
        return ret;
    }
    /**
     * @returns {number}
     */
    cells() {
        const ret = wasm.world_cells(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    cells_count() {
        const ret = wasm.world_cells_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    links() {
        const ret = wasm.world_links(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    links_count() {
        const ret = wasm.world_links_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    add_person() {
        wasm.world_add_person(this.__wbg_ptr);
    }
    /**
     * @returns {number}
     */
    persons() {
        const ret = wasm.world_persons(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    persons_count() {
        const ret = wasm.world_persons_count(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @param {number} x
     * @param {number} y
     */
    add_tree(x, y) {
        wasm.world_add_tree(this.__wbg_ptr, x, y);
    }
    /**
     * @returns {number}
     */
    trees() {
        const ret = wasm.world_trees(this.__wbg_ptr);
        return ret >>> 0;
    }
    /**
     * @returns {number}
     */
    trees_count() {
        const ret = wasm.world_trees_count(this.__wbg_ptr);
        return ret >>> 0;
    }
}

async function __wbg_load(module, imports) {
    if (typeof Response === 'function' && module instanceof Response) {
        if (typeof WebAssembly.instantiateStreaming === 'function') {
            try {
                return await WebAssembly.instantiateStreaming(module, imports);

            } catch (e) {
                if (module.headers.get('Content-Type') != 'application/wasm') {
                    console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);

                } else {
                    throw e;
                }
            }
        }

        const bytes = await module.arrayBuffer();
        return await WebAssembly.instantiate(bytes, imports);

    } else {
        const instance = await WebAssembly.instantiate(module, imports);

        if (instance instanceof WebAssembly.Instance) {
            return { instance, module };

        } else {
            return instance;
        }
    }
}

function __wbg_get_imports() {
    const imports = {};
    imports.wbg = {};
    imports.wbg.__wbg_alert_51386c6f83bdf47b = function(arg0, arg1) {
        alert(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_error_7534b8e9a36f1ab4 = function(arg0, arg1) {
        let deferred0_0;
        let deferred0_1;
        try {
            deferred0_0 = arg0;
            deferred0_1 = arg1;
            console.error(getStringFromWasm0(arg0, arg1));
        } finally {
            wasm.__wbindgen_free(deferred0_0, deferred0_1, 1);
        }
    };
    imports.wbg.__wbg_getTime_46267b1c24877e30 = function(arg0) {
        const ret = arg0.getTime();
        return ret;
    };
    imports.wbg.__wbg_log_578b93299d39cc8a = function(arg0, arg1) {
        console.log(getStringFromWasm0(arg0, arg1));
    };
    imports.wbg.__wbg_new0_f788a2397c7ca929 = function() {
        const ret = new Date();
        return ret;
    };
    imports.wbg.__wbg_new_8a6f238a6ece86ea = function() {
        const ret = new Error();
        return ret;
    };
    imports.wbg.__wbg_stack_0ed75d68575b0f3c = function(arg0, arg1) {
        const ret = arg1.stack;
        const ptr1 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
        const len1 = WASM_VECTOR_LEN;
        getDataViewMemory0().setInt32(arg0 + 4 * 1, len1, true);
        getDataViewMemory0().setInt32(arg0 + 4 * 0, ptr1, true);
    };
    imports.wbg.__wbindgen_init_externref_table = function() {
        const table = wasm.__wbindgen_export_3;
        const offset = table.grow(4);
        table.set(0, undefined);
        table.set(offset + 0, undefined);
        table.set(offset + 1, null);
        table.set(offset + 2, true);
        table.set(offset + 3, false);
        ;
    };
    imports.wbg.__wbindgen_throw = function(arg0, arg1) {
        throw new Error(getStringFromWasm0(arg0, arg1));
    };

    return imports;
}

function __wbg_init_memory(imports, memory) {

}

function __wbg_finalize_init(instance, module) {
    wasm = instance.exports;
    __wbg_init.__wbindgen_wasm_module = module;
    cachedDataViewMemory0 = null;
    cachedUint8ArrayMemory0 = null;


    wasm.__wbindgen_start();
    return wasm;
}

function initSync(module) {
    if (wasm !== undefined) return wasm;


    if (typeof module !== 'undefined') {
        if (Object.getPrototypeOf(module) === Object.prototype) {
            ({module} = module)
        } else {
            console.warn('using deprecated parameters for `initSync()`; pass a single object instead')
        }
    }

    const imports = __wbg_get_imports();

    __wbg_init_memory(imports);

    if (!(module instanceof WebAssembly.Module)) {
        module = new WebAssembly.Module(module);
    }

    const instance = new WebAssembly.Instance(module, imports);

    return __wbg_finalize_init(instance, module);
}

async function __wbg_init(module_or_path) {
    if (wasm !== undefined) return wasm;


    if (typeof module_or_path !== 'undefined') {
        if (Object.getPrototypeOf(module_or_path) === Object.prototype) {
            ({module_or_path} = module_or_path)
        } else {
            console.warn('using deprecated parameters for the initialization function; pass a single object instead')
        }
    }

    if (typeof module_or_path === 'undefined') {
        module_or_path = new URL('miniciv_bg.wasm', import.meta.url);
    }
    const imports = __wbg_get_imports();

    if (typeof module_or_path === 'string' || (typeof Request === 'function' && module_or_path instanceof Request) || (typeof URL === 'function' && module_or_path instanceof URL)) {
        module_or_path = fetch(module_or_path);
    }

    __wbg_init_memory(imports);

    const { instance, module } = await __wbg_load(await module_or_path, imports);

    return __wbg_finalize_init(instance, module);
}

export { initSync };
export default __wbg_init;
