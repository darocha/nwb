const DEFAULT_STAGE = 2

export default function createBabelConfig(buildConfig = {}, userConfig = {}) {
  let {
    native,
    plugins: buildPlugins = [],
    presets: buildPresets,
    runtime: buildRuntime,
    stage: buildStage = DEFAULT_STAGE,
  } = buildConfig

  let {
    loose,
    plugins: userPlugins = [],
    presets: userPresets,
    runtime: userRuntime,
    stage: userStage,
  } = userConfig

  let presets = []

  // ES2015 preset
  presets.push(
    require.resolve(
      `deduped-babel-presets/es2015${loose ? '-loose' : ''}${native ? '-native' : ''}`
    )
  )

  // Stage preset
  let stage = userStage != null ? userStage : buildStage
  if (typeof stage == 'number') {
    presets.push(
      require.resolve(`deduped-babel-presets/stage-${stage}`)
    )
  }

  // Additional build presets (preset names from deduped-babel-presets)
  if (Array.isArray(buildPresets)) {
    buildPresets.forEach(preset => {
      presets.push(require.resolve(`deduped-babel-presets/${preset}`))
    })
  }

  // Runtime transform
  let runtime = userRuntime != null ? userRuntime : buildRuntime
  if (runtime) {
    if (runtime === true) {
      presets.push(require.resolve(`deduped-babel-presets/runtime`))
    }
    else {
      presets.push(require.resolve(`deduped-babel-presets/runtime-${runtime}`))
    }
  }

  if (userPresets) {
    presets = [...presets, ...userPresets]
  }

  let config = {presets}

  let plugins = [...buildPlugins, ...userPlugins]
  if (plugins.length > 0) {
    config.plugins = plugins
  }

  return config
}