#!/bin/sh
cd $HOME/github.com/loicbourgois/miniciv
dprint fmt
cargo +nightly fmt
cargo clippy --release \
    -- -Dwarnings -Dclippy::pedantic \
    -Aclippy::cast_precision_loss \
    -Aclippy::cast_sign_loss \
    -Aclippy::cast_possible_truncation \
    -Aclippy::similar_names \
    -Aclippy::cast_possible_wrap \
    -Aclippy::too_many_lines \
    -Aclippy::too_many_arguments \
    -Aclippy::module_name_repetitions
RUSTFLAGS='--cfg getrandom_backend="wasm_js"' wasm-pack build --target web
cp $HOME/github.com/loicbourgois/miniciv/pkg/miniciv_bg.wasm $HOME/github.com/loicbourgois/miniciv/front/miniciv_bg.wasm
cp $HOME/github.com/loicbourgois/miniciv/pkg/miniciv.js $HOME/github.com/loicbourgois/miniciv/front/miniciv.js
cp $HOME/github.com/loicbourgois/miniciv/pkg/miniciv_bg.wasm $HOME/github.com/loicbourgois/miniciv/front/miniciv_bg.wasm
