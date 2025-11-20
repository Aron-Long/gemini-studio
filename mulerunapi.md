# Create Chat Completion

> Creates a new chat completion for the given model and prompt.

## OpenAPI

````yaml api-reference/endpoint/openai/openai.yaml post /v1/chat/completions
paths:
  path: /v1/chat/completions
  method: post
  servers:
    - url: https://api.mulerun.com/
  request:
    security:
      - title: bearerAuth
        parameters:
          query: {}
          header:
            Authorization:
              type: http
              scheme: bearer
          cookie: {}
    parameters:
      path: {}
      query: {}
      header: {}
      cookie: {}
    body:
      application/json:
        schemaArray:
          - type: object
            properties:
              messages:
                allOf:
                  - description: >
                      A list of messages comprising the conversation so far.
                      Depending on the

                      model you use, different message types (modalities) are

                      supported, like text,

                      images, and audio.
                    type: array
                    minItems: 1
                    items:
                      $ref: '#/components/schemas/ChatCompletionRequestMessage'
              model:
                allOf:
                  - description: >
                      Model ID used to generate the response, like `gpt-5`.
                      OpenAI

                      offers a wide range of models with different capabilities,
                      performance

                      characteristics, and price points. 

                      to browse and compare available models.
                    $ref: '#/components/schemas/ModelIdsShared'
              modalities:
                allOf:
                  - $ref: '#/components/schemas/ResponseModalities'
              verbosity:
                allOf:
                  - $ref: '#/components/schemas/Verbosity'
              reasoning_effort:
                allOf:
                  - $ref: '#/components/schemas/ReasoningEffort'
              max_completion_tokens:
                allOf:
                  - description: >
                      An upper bound for the number of tokens that can be
                      generated for a completion, including visible output
                      tokens and reasoning tokens.
                    type: integer
                    nullable: true
              frequency_penalty:
                allOf:
                  - type: number
                    minimum: -2
                    maximum: 2
                    nullable: true
                    description: >
                      Number between -2.0 and 2.0. Positive values penalize new
                      tokens based on

                      their existing frequency in the text so far, decreasing
                      the model's

                      likelihood to repeat the same line verbatim.
              presence_penalty:
                allOf:
                  - type: number
                    minimum: -2
                    maximum: 2
                    nullable: true
                    description: >
                      Number between -2.0 and 2.0. Positive values penalize new
                      tokens based on

                      whether they appear in the text so far, increasing the
                      model's likelihood

                      to talk about new topics.
              web_search_options:
                allOf:
                  - type: object
                    title: Web search
                    description: >
                      This tool searches the web for relevant results to use in
                      a response.
                    properties:
                      user_location:
                        type: object
                        nullable: true
                        required:
                          - type
                          - approximate
                        description: |
                          Approximate location parameters for the search.
                        properties:
                          type:
                            type: string
                            description: >
                              The type of location approximation. Always
                              `approximate`.
                            enum:
                              - approximate
                            x-stainless-const: true
                          approximate:
                            $ref: '#/components/schemas/WebSearchLocation'
                      search_context_size:
                        $ref: '#/components/schemas/WebSearchContextSize'
              top_logprobs:
                allOf:
                  - description: >
                      An integer between 0 and 20 specifying the number of most
                      likely tokens to

                      return at each token position, each with an associated log
                      probability.

                      `logprobs` must be set to `true` if this parameter is
                      used.
                    type: integer
                    minimum: 0
                    maximum: 20
                    nullable: true
                  - description: >
                      An integer between 0 and 20 specifying the number of most
                      likely tokens to

                      return at each token position, each with an associated log
                      probability.
                    type: integer
                    minimum: 0
                    maximum: 20
                    nullable: true
                  - description: >
                      An integer between 0 and 20 specifying the number of most
                      likely tokens to

                      return at each token position, each with an associated log
                      probability.
                    type: integer
                    minimum: 0
                    maximum: 20
              response_format:
                allOf:
                  - description: >
                      An object specifying the format that the model must
                      output.


                      Setting to `{ "type": "json_schema", "json_schema": {...}
                      }` enables

                      Structured Outputs which ensures the model will match your
                      supplied JSON

                      schema. 


                      Setting to `{ "type": "json_object" }` enables the older
                      JSON mode, which

                      ensures the message the model generates is valid JSON.
                      Using `json_schema`

                      is preferred for models that support it.
                    anyOf:
                      - $ref: '#/components/schemas/ResponseFormatText'
                      - $ref: '#/components/schemas/ResponseFormatJsonSchema'
                      - $ref: '#/components/schemas/ResponseFormatJsonObject'
              audio:
                allOf:
                  - type: object
                    nullable: true
                    description: >
                      Parameters for audio output. Required when audio output is
                      requested with

                      `modalities: ["audio"]`. 
                    required:
                      - voice
                      - format
                    properties:
                      voice:
                        $ref: '#/components/schemas/VoiceIdsShared'
                        description: >
                          The voice the model uses to respond. Supported voices
                          are

                          `alloy`, `ash`, `ballad`, `coral`, `echo`, `fable`,
                          `nova`, `onyx`, `sage`, and `shimmer`.
                      format:
                        type: string
                        enum:
                          - wav
                          - aac
                          - mp3
                          - flac
                          - opus
                          - pcm16
                        description: >
                          Specifies the output audio format. Must be one of
                          `wav`, `mp3`, `flac`,

                          `opus`, or `pcm16`.
              store:
                allOf:
                  - type: boolean
                    nullable: true
                    description: >
                      Whether or not to store the output of this chat completion
                      request for

                      use in our model distillation or

                      evals products.


                      Supports text and image inputs. Note: image inputs over
                      8MB will be dropped.
              stream:
                allOf:
                  - description: >
                      If set to true, the model response data will be streamed
                      to the client

                      as it is generated using [server-sent
                      events](https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events#Event_stream_format).
                    type: boolean
                    nullable: true
              stop:
                allOf:
                  - $ref: '#/components/schemas/StopConfiguration'
              logit_bias:
                allOf:
                  - type: object
                    x-oaiTypeLabel: map
                    nullable: true
                    additionalProperties:
                      type: integer
                    description: >
                      Modify the likelihood of specified tokens appearing in the
                      completion.


                      Accepts a JSON object that maps tokens (specified by their
                      token ID in the

                      tokenizer) to an associated bias value from -100 to 100.
                      Mathematically,

                      the bias is added to the logits generated by the model
                      prior to sampling.

                      The exact effect will vary per model, but values between
                      -1 and 1 should

                      decrease or increase likelihood of selection; values like
                      -100 or 100

                      should result in a ban or exclusive selection of the
                      relevant token.
              logprobs:
                allOf:
                  - description: >
                      Whether to return log probabilities of the output tokens
                      or not. If true,

                      returns the log probabilities of each output token
                      returned in the

                      `content` of `message`.
                    type: boolean
                    nullable: true
              max_tokens:
                allOf:
                  - description: >
                      The maximum number of tokens that can be generated in the

                      chat completion. This value can be used to control

                      costs for text generated via API.


                      This value is now deprecated in favor of
                      `max_completion_tokens`, and is

                      not compatible with o-series models.
                    type: integer
                    nullable: true
                    deprecated: true
              'n':
                allOf:
                  - type: integer
                    minimum: 1
                    maximum: 128
                    example: 1
                    nullable: true
                    description: >-
                      How many chat completion choices to generate for each
                      input message. Note that you will be charged based on the
                      number of generated tokens across all of the choices. Keep
                      `n` as `1` to minimize costs.
              prediction:
                allOf:
                  - nullable: true
                    description: >
                      Configuration for a Predicted Output

                      which can greatly improve response times when large parts
                      of the model

                      response are known ahead of time. This is most common when
                      you are

                      regenerating a file with only minor changes to most of the
                      content.
                    anyOf:
                      - $ref: '#/components/schemas/PredictionContent'
                    discriminator:
                      propertyName: type
              seed:
                allOf:
                  - type: integer
                    minimum: -9223372036854776000
                    maximum: 9223372036854776000
                    nullable: true
                    deprecated: true
                    description: >
                      This feature is in Beta.

                      If specified, our system will make a best effort to sample
                      deterministically, such that repeated requests with the
                      same `seed` and parameters should return the same result.

                      Determinism is not guaranteed, and you should refer to the
                      `system_fingerprint` response parameter to monitor changes
                      in the backend.
                    x-oaiMeta:
                      beta: true
              stream_options:
                allOf:
                  - $ref: '#/components/schemas/ChatCompletionStreamOptions'
              tools:
                allOf:
                  - type: array
                    description: |
                      A list of tools the model may call. You can provide either
                      custom tools or
                      function tools.
                    items:
                      anyOf:
                        - $ref: '#/components/schemas/ChatCompletionTool'
                        - $ref: '#/components/schemas/CustomToolChatCompletions'
                      x-stainless-naming:
                        python:
                          model_name: chat_completion_tool_union
                          param_model_name: chat_completion_tool_union_param
                      discriminator:
                        propertyName: type
                      x-stainless-go-variant-constructor:
                        naming: chat_completion_{variant}_tool
              tool_choice:
                allOf:
                  - $ref: '#/components/schemas/ChatCompletionToolChoiceOption'
              parallel_tool_calls:
                allOf:
                  - $ref: '#/components/schemas/ParallelToolCalls'
              function_call:
                allOf:
                  - deprecated: true
                    description: >
                      Deprecated in favor of `tool_choice`.


                      Controls which (if any) function is called by the model.


                      `none` means the model will not call a function and
                      instead generates a

                      message.


                      `auto` means the model can pick between generating a
                      message or calling a

                      function.


                      Specifying a particular function via `{"name":
                      "my_function"}` forces the

                      model to call that function.


                      `none` is the default when no functions are present.
                      `auto` is the default

                      if functions are present.
                    anyOf:
                      - type: string
                        description: >
                          `none` means the model will not call a function and
                          instead generates a message. `auto` means the model
                          can pick between generating a message or calling a
                          function.
                        enum:
                          - none
                          - auto
                        title: function call mode
                      - $ref: '#/components/schemas/ChatCompletionFunctionCallOption'
              functions:
                allOf:
                  - deprecated: true
                    description: >
                      Deprecated in favor of `tools`.


                      A list of functions the model may generate JSON inputs
                      for.
                    type: array
                    minItems: 1
                    maxItems: 128
                    items:
                      $ref: '#/components/schemas/ChatCompletionFunctions'
              metadata:
                allOf:
                  - $ref: '#/components/schemas/Metadata'
              temperature:
                allOf:
                  - type: number
                    minimum: 0
                    maximum: 2
                    example: 1
                    nullable: true
                    description: >
                      What sampling temperature to use, between 0 and 2. Higher
                      values like 0.8 will make the output more random, while
                      lower values like 0.2 will make it more focused and
                      deterministic.

                      We generally recommend altering this or `top_p` but not
                      both.
              top_p:
                allOf:
                  - type: number
                    minimum: 0
                    maximum: 1
                    example: 1
                    nullable: true
                    description: >
                      An alternative to sampling with temperature, called
                      nucleus sampling,

                      where the model considers the results of the tokens with
                      top_p probability

                      mass. So 0.1 means only the tokens comprising the top 10%
                      probability mass

                      are considered.


                      We generally recommend altering this or `temperature` but
                      not both.
              user:
                allOf:
                  - type: string
                    example: user-1234
                    deprecated: true
                    description: >
                      This field is being replaced by `safety_identifier` and
                      `prompt_cache_key`. Use `prompt_cache_key` instead to
                      maintain caching optimizations.

                      A stable identifier for your end-users. 

                      Used to boost cache hit rates by better bucketing similar
                      requests and  to help OpenAI detect and prevent abuse.
                      information. 
              service_tier:
                allOf:
                  - $ref: '#/components/schemas/ServiceTier'
            required: true
            refIdentifier: '#/components/schemas/ModelResponseProperties'
            requiredProperties:
              - model
              - messages
        examples:
          example:
            value:
              model: gpt-5
              messages:
                - role: user
                  content: Hello! How are you?
  response:
    '200':
      application/json:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - type: string
                    description: A unique identifier for the chat completion.
              choices:
                allOf:
                  - type: array
                    description: >-
                      A list of chat completion choices. Can be more than one if
                      `n` is greater than 1.
                    items:
                      type: object
                      required:
                        - finish_reason
                        - index
                        - message
                        - logprobs
                      properties:
                        finish_reason:
                          type: string
                          description: >
                            The reason the model stopped generating tokens. This
                            will be `stop` if the model hit a natural stop point
                            or a provided stop sequence,

                            `length` if the maximum number of tokens specified
                            in the request was reached,

                            `content_filter` if content was omitted due to a
                            flag from our content filters,

                            `tool_calls` if the model called a tool, or
                            `function_call` (deprecated) if the model called a
                            function.
                          enum:
                            - stop
                            - length
                            - tool_calls
                            - content_filter
                            - function_call
                        index:
                          type: integer
                          description: The index of the choice in the list of choices.
                        message:
                          $ref: '#/components/schemas/ChatCompletionResponseMessage'
                        logprobs:
                          description: Log probability information for the choice.
                          type: object
                          nullable: true
                          properties:
                            content:
                              description: >-
                                A list of message content tokens with log
                                probability information.
                              type: array
                              items:
                                $ref: >-
                                  #/components/schemas/ChatCompletionTokenLogprob
                              nullable: true
                            refusal:
                              description: >-
                                A list of message refusal tokens with log
                                probability information.
                              type: array
                              items:
                                $ref: >-
                                  #/components/schemas/ChatCompletionTokenLogprob
                              nullable: true
                          required:
                            - content
                            - refusal
              created:
                allOf:
                  - type: integer
                    description: >-
                      The Unix timestamp (in seconds) of when the chat
                      completion was created.
              model:
                allOf:
                  - type: string
                    description: The model used for the chat completion.
              service_tier:
                allOf:
                  - $ref: '#/components/schemas/ServiceTier'
              system_fingerprint:
                allOf:
                  - type: string
                    deprecated: true
                    description: >
                      This fingerprint represents the backend configuration that
                      the model runs with.


                      Can be used in conjunction with the `seed` request
                      parameter to understand when backend changes have been
                      made that might impact determinism.
              object:
                allOf:
                  - type: string
                    description: The object type, which is always `chat.completion`.
                    enum:
                      - chat.completion
                    x-stainless-const: true
              usage:
                allOf:
                  - $ref: '#/components/schemas/CompletionUsage'
            description: >-
              Represents a chat completion response returned by model, based on
              the provided input.
            refIdentifier: '#/components/schemas/CreateChatCompletionResponse'
            requiredProperties:
              - choices
              - created
              - id
              - model
              - object
        examples:
          example:
            value:
              id: chatcmpl-fJ5wOo5nqnWz2Z9jkF4NK
              object: chat.completion
              created: 1715392980
              model: gpt-5
              choices:
                - index: 0
                  message:
                    role: assistant
                    content: Hello! How are you?
                    refusal: null
                    annotations: []
                  logprobs: null
                  finish_reason: stop
              usage:
                prompt_tokens: 10
                completion_tokens: 10
                total_tokens: 20
                prompt_tokens_details:
                  cached_tokens: 0
                  audio_tokens: 0
                completion_tokens_details:
                  cached_tokens: 0
                  audio_tokens: 0
                  accepted_prediction_tokens: 0
                  rejected_prediction_tokens: 0
        description: OK
      text/event-stream:
        schemaArray:
          - type: object
            properties:
              id:
                allOf:
                  - type: string
                    description: >-
                      A unique identifier for the chat completion. Each chunk
                      has the same ID.
              choices:
                allOf:
                  - type: array
                    description: >
                      A list of chat completion choices. Can contain more than
                      one elements if `n` is greater than 1. Can also be empty
                      for the

                      last chunk if you set `stream_options: {"include_usage":
                      true}`.
                    items:
                      type: object
                      required:
                        - delta
                        - finish_reason
                        - index
                      properties:
                        delta:
                          $ref: >-
                            #/components/schemas/ChatCompletionStreamResponseDelta
                        logprobs:
                          description: Log probability information for the choice.
                          type: object
                          nullable: true
                          properties:
                            content:
                              description: >-
                                A list of message content tokens with log
                                probability information.
                              type: array
                              items:
                                $ref: >-
                                  #/components/schemas/ChatCompletionTokenLogprob
                              nullable: true
                            refusal:
                              description: >-
                                A list of message refusal tokens with log
                                probability information.
                              type: array
                              items:
                                $ref: >-
                                  #/components/schemas/ChatCompletionTokenLogprob
                              nullable: true
                          required:
                            - content
                            - refusal
                        finish_reason:
                          type: string
                          description: >
                            The reason the model stopped generating tokens. This
                            will be `stop` if the model hit a natural stop point
                            or a provided stop sequence,

                            `length` if the maximum number of tokens specified
                            in the request was reached,

                            `content_filter` if content was omitted due to a
                            flag from our content filters,

                            `tool_calls` if the model called a tool, or
                            `function_call` (deprecated) if the model called a
                            function.
                          enum:
                            - stop
                            - length
                            - tool_calls
                            - content_filter
                            - function_call
                          nullable: true
                        index:
                          type: integer
                          description: The index of the choice in the list of choices.
              created:
                allOf:
                  - type: integer
                    description: >-
                      The Unix timestamp (in seconds) of when the chat
                      completion was created. Each chunk has the same timestamp.
              model:
                allOf:
                  - type: string
                    description: The model to generate the completion.
              service_tier:
                allOf:
                  - $ref: '#/components/schemas/ServiceTier'
              system_fingerprint:
                allOf:
                  - type: string
                    deprecated: true
                    description: >
                      This fingerprint represents the backend configuration that
                      the model runs with.

                      Can be used in conjunction with the `seed` request
                      parameter to understand when backend changes have been
                      made that might impact determinism.
              object:
                allOf:
                  - type: string
                    description: The object type, which is always `chat.completion.chunk`.
                    enum:
                      - chat.completion.chunk
                    x-stainless-const: true
              usage:
                allOf:
                  - $ref: '#/components/schemas/CompletionUsage'
                    nullable: true
                    description: >
                      An optional field that will only be present when you set

                      `stream_options: {"include_usage": true}` in your request.
                      When present, it

                      contains a null value **except for the last chunk** which
                      contains the

                      token usage statistics for the entire request.


                      **NOTE:** If the stream is interrupted or cancelled, you
                      may not

                      receive the final usage chunk which contains the total
                      token usage for

                      the request.
            description: |
              Represents a streamed chunk of a chat completion response returned
              by the model, based on the provided input. 
            refIdentifier: '#/components/schemas/CreateChatCompletionStreamResponse'
            requiredProperties:
              - choices
              - created
              - id
              - model
              - object
        examples:
          example:
            value:
              id: <string>
              choices:
                - delta:
                    content: <string>
                    function_call:
                      arguments: <string>
                      name: <string>
                    tool_calls:
                      - index: 123
                        id: <string>
                        type: function
                        function:
                          name: <string>
                          arguments: <string>
                    role: developer
                    refusal: <string>
                  logprobs:
                    content:
                      - token: <string>
                        logprob: 123
                        bytes:
                          - 123
                        top_logprobs:
                          - token: <string>
                            logprob: 123
                            bytes:
                              - <any>
                    refusal:
                      - token: <string>
                        logprob: 123
                        bytes:
                          - 123
                        top_logprobs:
                          - token: <string>
                            logprob: 123
                            bytes:
                              - <any>
                  finish_reason: stop
                  index: 123
              created: 123
              model: <string>
              service_tier: auto
              system_fingerprint: <string>
              object: chat.completion.chunk
              usage:
                completion_tokens: 0
                prompt_tokens: 0
                total_tokens: 0
                completion_tokens_details:
                  accepted_prediction_tokens: 0
                  audio_tokens: 0
                  reasoning_tokens: 0
                  rejected_prediction_tokens: 0
                prompt_tokens_details:
                  audio_tokens: 0
                  cached_tokens: 0
        description: OK
  deprecated: false
  type: path
components:
  schemas:
    ServiceTier:
      type: string
      description: |
        Specifies the processing type used for serving the request.
          - If set to 'auto', then the request will be processed with the service tier configured in the Project settings. Unless otherwise configured, the Project will use 'default'.
          - If set to 'default', then the request will be processed with the standard pricing and performance for the selected model.
          - If set to 'flex' or 'priority', then the request will be processed with the corresponding service tier.
          - When not set, the default behavior is 'auto'.

          When the `service_tier` parameter is set, the response body will include the `service_tier` value based on the processing mode actually used to serve the request. This response value may be different from the value set in the parameter.
      enum:
        - auto
        - default
        - flex
        - scale
        - priority
      nullable: true
    Metadata:
      type: object
      description: >
        Set of 16 key-value pairs that can be attached to an object. This can be

        useful for storing additional information about the object in a
        structured

        format, and querying for objects via API or the dashboard. 


        Keys are strings with a maximum length of 64 characters. Values are
        strings

        with a maximum length of 512 characters.
      additionalProperties:
        type: string
      nullable: true
    ResponseModalities:
      type: array
      nullable: true
      description: |
        Output types that you would like the model to generate.
        Most models are capable of generating text, which is the default:

        `["text"]`

        The `gpt-4o-audio-preview` model can also be used to 
        generate audio. To request that this model generate 
        both text and audio responses, you can use:

        `["text", "audio"]`
      items:
        type: string
        enum:
          - text
          - audio
    ModelIdsShared:
      example: gpt-5
      anyOf:
        - type: string
    Verbosity:
      type: string
      enum:
        - low
        - medium
        - high
      nullable: true
      description: >
        Constrains the verbosity of the model's response. Lower values will
        result in

        more concise responses, while higher values will result in more verbose
        responses.

        Currently supported values are `low`, `medium`, and `high`.
    ReasoningEffort:
      type: string
      enum:
        - minimal
        - low
        - medium
        - high
      nullable: true
      description: >
        Constrains effort on reasoning for 

        reasoning models.

        Currently supported values are `minimal`, `low`, `medium`, and `high`.
        Reducing

        reasoning effort can result in faster responses and fewer tokens used

        on reasoning in a response.
    PredictionContent:
      type: object
      title: Static Content
      description: >
        Static predicted output content, such as the content of a text file that
        is

        being regenerated.
      required:
        - type
        - content
      properties:
        type:
          type: string
          enum:
            - content
          description: |
            The type of the predicted content you want to provide. This type is
            currently always `content`.
          x-stainless-const: true
        content:
          description: >
            The content that should be matched when generating a model response.

            If generated tokens would match this content, the entire model
            response

            can be returned much more quickly.
          anyOf:
            - type: string
              title: Text content
              description: |
                The content used for a Predicted Output. This is often the
                text of a file you are regenerating with minor changes.
            - type: array
              description: >-
                An array of content parts with a defined type. Supported options
                differ based on the model being used to generate the response.
                Can contain text inputs.
              title: Array of content parts
              items:
                $ref: >-
                  #/components/schemas/ChatCompletionRequestMessageContentPartText
              minItems: 1
    WebSearchContextSize:
      type: string
      description: >
        High level guidance for the amount of context window space to use for
        the 

        search. One of `low`, `medium`, or `high`. `medium` is the default.
      enum:
        - low
        - medium
        - high
    WebSearchLocation:
      type: object
      title: Web search location
      description: Approximate location parameters for the search.
      properties:
        country:
          type: string
          description: |
            The two-letter 
            ISO country code of the user,
            e.g. `US`.
        region:
          type: string
          description: |
            Free text input for the region of the user, e.g. `California`.
        city:
          type: string
          description: |
            Free text input for the city of the user, e.g. `San Francisco`.
        timezone:
          type: string
          description: |
            The IANA timezone 
            of the user, e.g. `America/Los_Angeles`.
    ResponseFormatJsonObject:
      type: object
      title: JSON object
      description: >
        JSON object response format. An older method of generating JSON
        responses.

        Using `json_schema` is recommended for models that support it. Note that
        the

        model will not generate JSON without a system or user message
        instructing it

        to do so.
      properties:
        type:
          type: string
          description: The type of response format being defined. Always `json_object`.
          enum:
            - json_object
          x-stainless-const: true
      required:
        - type
    ResponseFormatJsonSchema:
      type: object
      title: JSON schema
      description: |
        JSON Schema response format. Used to generate structured JSON responses.
      properties:
        type:
          type: string
          description: The type of response format being defined. Always `json_schema`.
          enum:
            - json_schema
          x-stainless-const: true
        json_schema:
          type: object
          title: JSON schema
          description: |
            Structured Outputs configuration options, including a JSON Schema.
          properties:
            description:
              type: string
              description: >
                A description of what the response format is for, used by the
                model to

                determine how to respond in the format.
            name:
              type: string
              description: >
                The name of the response format. Must be a-z, A-Z, 0-9, or
                contain

                underscores and dashes, with a maximum length of 64.
            schema:
              $ref: '#/components/schemas/ResponseFormatJsonSchemaSchema'
            strict:
              type: boolean
              nullable: true
              default: false
              description: >
                Whether to enable strict schema adherence when generating the
                output.

                If set to true, the model will always follow the exact schema
                defined

                in the `schema` field. Only a subset of JSON Schema is supported
                when

                `strict` is `true`. 
          required:
            - name
      required:
        - type
        - json_schema
    ResponseFormatJsonSchemaSchema:
      type: object
      title: JSON schema
      description: |
        The schema for the response format, described as a JSON Schema object.
      additionalProperties: true
    ResponseFormatText:
      type: object
      title: Text
      description: |
        Default response format. Used to generate text responses.
      properties:
        type:
          type: string
          description: The type of response format being defined. Always `text`.
          enum:
            - text
          x-stainless-const: true
      required:
        - type
    VoiceIdsShared:
      example: ash
      anyOf:
        - type: string
        - type: string
          enum:
            - alloy
            - ash
            - ballad
            - coral
            - echo
            - sage
            - shimmer
            - verse
            - marin
            - cedar
    ParallelToolCalls:
      description: Whether to enable parallel function calling during tool use.
      type: boolean
    StopConfiguration:
      description: |
        Not supported with latest reasoning models `o3` and `o4-mini`.

        Up to 4 sequences where the API will stop generating further tokens. The
        returned text will not contain the stop sequence.
      nullable: true
      anyOf:
        - type: string
          example: |+

          nullable: true
        - type: array
          minItems: 1
          maxItems: 4
          items:
            type: string
            example: '["\n"]'
    CustomToolChatCompletions:
      type: object
      title: Custom tool
      description: |
        A custom tool that processes input using a specified format.
      properties:
        type:
          type: string
          enum:
            - custom
          description: The type of the custom tool. Always `custom`.
          x-stainless-const: true
        custom:
          type: object
          title: Custom tool properties
          description: |
            Properties of the custom tool.
          properties:
            name:
              type: string
              description: The name of the custom tool, used to identify it in tool calls.
            description:
              type: string
              description: >
                Optional description of the custom tool, used to provide more
                context.
            format:
              description: >
                The input format for the custom tool. Default is unconstrained
                text.
              anyOf:
                - type: object
                  title: Text format
                  description: Unconstrained free-form text.
                  properties:
                    type:
                      type: string
                      enum:
                        - text
                      description: Unconstrained text format. Always `text`.
                      x-stainless-const: true
                  required:
                    - type
                  additionalProperties: false
                - type: object
                  title: Grammar format
                  description: A grammar defined by the user.
                  properties:
                    type:
                      type: string
                      enum:
                        - grammar
                      description: Grammar format. Always `grammar`.
                      x-stainless-const: true
                    grammar:
                      type: object
                      title: Grammar format
                      description: Your chosen grammar.
                      properties:
                        definition:
                          type: string
                          description: The grammar definition.
                        syntax:
                          type: string
                          description: >-
                            The syntax of the grammar definition. One of `lark`
                            or `regex`.
                          enum:
                            - lark
                            - regex
                      required:
                        - definition
                        - syntax
                  required:
                    - type
                    - grammar
                  additionalProperties: false
              discriminator:
                propertyName: type
          required:
            - name
      required:
        - type
        - custom
    CompletionUsage:
      type: object
      description: Usage statistics for the completion request.
      properties:
        completion_tokens:
          type: integer
          default: 0
          description: Number of tokens in the generated completion.
        prompt_tokens:
          type: integer
          default: 0
          description: Number of tokens in the prompt.
        total_tokens:
          type: integer
          default: 0
          description: Total number of tokens used in the request (prompt + completion).
        completion_tokens_details:
          type: object
          description: Breakdown of tokens used in a completion.
          properties:
            accepted_prediction_tokens:
              type: integer
              default: 0
              description: |
                When using Predicted Outputs, the number of tokens in the
                prediction that appeared in the completion.
            audio_tokens:
              type: integer
              default: 0
              description: Audio input tokens generated by the model.
            reasoning_tokens:
              type: integer
              default: 0
              description: Tokens generated by the model for reasoning.
            rejected_prediction_tokens:
              type: integer
              default: 0
              description: >
                When using Predicted Outputs, the number of tokens in the

                prediction that did not appear in the completion. However, like

                reasoning tokens, these tokens are still counted in the total

                completion tokens for purposes of billing, output, and context
                window

                limits.
        prompt_tokens_details:
          type: object
          description: Breakdown of tokens used in the prompt.
          properties:
            audio_tokens:
              type: integer
              default: 0
              description: Audio input tokens present in the prompt.
            cached_tokens:
              type: integer
              default: 0
              description: Cached tokens present in the prompt.
      required:
        - prompt_tokens
        - completion_tokens
        - total_tokens
    ChatCompletionAllowedTools:
      type: object
      title: Allowed tools
      description: |
        Constrains the tools available to the model to a pre-defined set.
      properties:
        mode:
          type: string
          enum:
            - auto
            - required
          description: >
            Constrains the tools available to the model to a pre-defined set.


            `auto` allows the model to pick from among the allowed tools and
            generate a

            message.


            `required` requires the model to call one or more of the allowed
            tools.
        tools:
          type: array
          description: >
            A list of tool definitions that the model should be allowed to call.


            For the Chat Completions API, the list of tool definitions might
            look like:

            ```json

            [
              { "type": "function", "function": { "name": "get_weather" } },
              { "type": "function", "function": { "name": "get_time" } }
            ]

            ```
          items:
            type: object
            x-oaiExpandable: false
            description: |
              A tool definition that the model should be allowed to call.
            additionalProperties: true
      required:
        - mode
        - tools
    ChatCompletionAllowedToolsChoice:
      type: object
      title: Allowed tools
      description: |
        Constrains the tools available to the model to a pre-defined set.
      properties:
        type:
          type: string
          enum:
            - allowed_tools
          description: Allowed tool configuration type. Always `allowed_tools`.
          x-stainless-const: true
        allowed_tools:
          $ref: '#/components/schemas/ChatCompletionAllowedTools'
      required:
        - type
        - allowed_tools
    ChatCompletionFunctionCallOption:
      type: object
      description: >
        Specifying a particular function via `{"name": "my_function"}` forces
        the model to call that function.
      properties:
        name:
          type: string
          description: The name of the function to call.
      required:
        - name
      x-stainless-variantName: function_call_option
    ChatCompletionFunctions:
      type: object
      deprecated: true
      properties:
        description:
          type: string
          description: >-
            A description of what the function does, used by the model to choose
            when and how to call the function.
        name:
          type: string
          description: >-
            The name of the function to be called. Must be a-z, A-Z, 0-9, or
            contain underscores and dashes, with a maximum length of 64.
        parameters:
          $ref: '#/components/schemas/FunctionParameters'
      required:
        - name
    ChatCompletionMessageCustomToolCall:
      type: object
      title: Custom tool call
      description: |
        A call to a custom tool created by the model.
      properties:
        id:
          type: string
          description: The ID of the tool call.
        type:
          type: string
          enum:
            - custom
          description: The type of the tool. Always `custom`.
          x-stainless-const: true
        custom:
          type: object
          description: The custom tool that the model called.
          properties:
            name:
              type: string
              description: The name of the custom tool to call.
            input:
              type: string
              description: The input for the custom tool call generated by the model.
          required:
            - name
            - input
      required:
        - id
        - type
        - custom
    ChatCompletionMessageToolCall:
      type: object
      title: Function tool call
      description: |
        A call to a function tool created by the model.
      properties:
        id:
          type: string
          description: The ID of the tool call.
        type:
          type: string
          enum:
            - function
          description: The type of the tool. Currently, only `function` is supported.
          x-stainless-const: true
        function:
          type: object
          description: The function that the model called.
          properties:
            name:
              type: string
              description: The name of the function to call.
            arguments:
              type: string
              description: >-
                The arguments to call the function with, as generated by the
                model in JSON format. Note that the model does not always
                generate valid JSON, and may hallucinate parameters not defined
                by your function schema. Validate the arguments in your code
                before calling your function.
          required:
            - name
            - arguments
      required:
        - id
        - type
        - function
    ChatCompletionMessageToolCallChunk:
      type: object
      properties:
        index:
          type: integer
        id:
          type: string
          description: The ID of the tool call.
        type:
          type: string
          enum:
            - function
          description: The type of the tool. Currently, only `function` is supported.
          x-stainless-const: true
        function:
          type: object
          properties:
            name:
              type: string
              description: The name of the function to call.
            arguments:
              type: string
              description: >-
                The arguments to call the function with, as generated by the
                model in JSON format. Note that the model does not always
                generate valid JSON, and may hallucinate parameters not defined
                by your function schema. Validate the arguments in your code
                before calling your function.
      required:
        - index
    ChatCompletionMessageToolCalls:
      type: array
      description: The tool calls generated by the model, such as function calls.
      items:
        anyOf:
          - $ref: '#/components/schemas/ChatCompletionMessageToolCall'
          - $ref: '#/components/schemas/ChatCompletionMessageCustomToolCall'
        x-stainless-naming:
          python:
            model_name: chat_completion_message_tool_call_union
            param_model_name: chat_completion_message_tool_call_union_param
        discriminator:
          propertyName: type
        x-stainless-go-variant-constructor: skip
    ChatCompletionNamedToolChoice:
      type: object
      title: Function tool choice
      description: >-
        Specifies a tool the model should use. Use to force the model to call a
        specific function.
      properties:
        type:
          type: string
          enum:
            - function
          description: For function calling, the type is always `function`.
          x-stainless-const: true
        function:
          type: object
          properties:
            name:
              type: string
              description: The name of the function to call.
          required:
            - name
      required:
        - type
        - function
    ChatCompletionNamedToolChoiceCustom:
      type: object
      title: Custom tool choice
      description: >-
        Specifies a tool the model should use. Use to force the model to call a
        specific custom tool.
      properties:
        type:
          type: string
          enum:
            - custom
          description: For custom tool calling, the type is always `custom`.
          x-stainless-const: true
        custom:
          type: object
          properties:
            name:
              type: string
              description: The name of the custom tool to call.
          required:
            - name
      required:
        - type
        - custom
    ChatCompletionRequestAssistantMessage:
      type: object
      title: Assistant message
      description: |
        Messages sent by the model in response to user messages.
      properties:
        content:
          nullable: true
          description: >
            The contents of the assistant message. Required unless `tool_calls`
            or `function_call` is specified.
          anyOf:
            - type: string
              description: The contents of the assistant message.
              title: Text content
            - type: array
              description: >-
                An array of content parts with a defined type. Can be one or
                more of type `text`, or exactly one of type `refusal`.
              title: Array of content parts
              items:
                $ref: >-
                  #/components/schemas/ChatCompletionRequestAssistantMessageContentPart
              minItems: 1
        refusal:
          nullable: true
          type: string
          description: The refusal message by the assistant.
        role:
          type: string
          enum:
            - assistant
          description: The role of the messages author, in this case `assistant`.
          x-stainless-const: true
        name:
          type: string
          description: >-
            An optional name for the participant. Provides the model information
            to differentiate between participants of the same role.
        audio:
          type: object
          nullable: true
          description: |
            Data about a previous audio response from the model. 
          required:
            - id
          properties:
            id:
              type: string
              description: |
                Unique identifier for a previous audio response from the model.
        tool_calls:
          $ref: '#/components/schemas/ChatCompletionMessageToolCalls'
        function_call:
          type: object
          deprecated: true
          description: >-
            Deprecated and replaced by `tool_calls`. The name and arguments of a
            function that should be called, as generated by the model.
          nullable: true
          properties:
            arguments:
              type: string
              description: >-
                The arguments to call the function with, as generated by the
                model in JSON format. Note that the model does not always
                generate valid JSON, and may hallucinate parameters not defined
                by your function schema. Validate the arguments in your code
                before calling your function.
            name:
              type: string
              description: The name of the function to call.
          required:
            - arguments
            - name
      required:
        - role
      x-stainless-soft-required:
        - content
    ChatCompletionRequestAssistantMessageContentPart:
      anyOf:
        - $ref: '#/components/schemas/ChatCompletionRequestMessageContentPartText'
        - $ref: '#/components/schemas/ChatCompletionRequestMessageContentPartRefusal'
      discriminator:
        propertyName: type
    ChatCompletionRequestDeveloperMessage:
      type: object
      title: Developer message
      description: >
        Developer-provided instructions that the model should follow, regardless
        of

        messages sent by the user. With o1 models and newer, `developer`
        messages

        replace the previous `system` messages.
      properties:
        content:
          description: The contents of the developer message.
          anyOf:
            - type: string
              description: The contents of the developer message.
              title: Text content
            - type: array
              description: >-
                An array of content parts with a defined type. For developer
                messages, only type `text` is supported.
              title: Array of content parts
              items:
                $ref: >-
                  #/components/schemas/ChatCompletionRequestMessageContentPartText
              minItems: 1
        role:
          type: string
          enum:
            - developer
          description: The role of the messages author, in this case `developer`.
          x-stainless-const: true
        name:
          type: string
          description: >-
            An optional name for the participant. Provides the model information
            to differentiate between participants of the same role.
      required:
        - content
        - role
      x-stainless-naming:
        go:
          variant_constructor: DeveloperMessage
    ChatCompletionRequestFunctionMessage:
      type: object
      title: Function message
      deprecated: true
      properties:
        role:
          type: string
          enum:
            - function
          description: The role of the messages author, in this case `function`.
          x-stainless-const: true
        content:
          nullable: true
          type: string
          description: The contents of the function message.
        name:
          type: string
          description: The name of the function to call.
      required:
        - role
        - content
        - name
    ChatCompletionRequestMessage:
      anyOf:
        - $ref: '#/components/schemas/ChatCompletionRequestDeveloperMessage'
        - $ref: '#/components/schemas/ChatCompletionRequestSystemMessage'
        - $ref: '#/components/schemas/ChatCompletionRequestUserMessage'
        - $ref: '#/components/schemas/ChatCompletionRequestAssistantMessage'
        - $ref: '#/components/schemas/ChatCompletionRequestToolMessage'
        - $ref: '#/components/schemas/ChatCompletionRequestFunctionMessage'
      discriminator:
        propertyName: role
    ChatCompletionRequestMessageContentPartAudio:
      type: object
      title: Audio content part
      description: |
        Learn about audio inputs.
      properties:
        type:
          type: string
          enum:
            - input_audio
          description: The type of the content part. Always `input_audio`.
          x-stainless-const: true
        input_audio:
          type: object
          properties:
            data:
              type: string
              description: Base64 encoded audio data.
            format:
              type: string
              enum:
                - wav
                - mp3
              description: >
                The format of the encoded audio data. Currently supports "wav"
                and "mp3".
          required:
            - data
            - format
      required:
        - type
        - input_audio
      x-stainless-naming:
        go:
          variant_constructor: InputAudioContentPart
    ChatCompletionRequestMessageContentPartFile:
      type: object
      title: File content part
      description: |
        Learn about file inputs for text generation.
      properties:
        type:
          type: string
          enum:
            - file
          description: The type of the content part. Always `file`.
          x-stainless-const: true
        file:
          type: object
          properties:
            filename:
              type: string
              description: >
                The name of the file, used when passing the file to the model as
                a 

                string.
            file_data:
              type: string
              description: >
                The base64 encoded file data, used when passing the file to the
                model 

                as a string.
            file_id:
              type: string
              description: |
                The ID of an uploaded file to use as input.
          x-stainless-naming:
            java:
              type_name: FileObject
            kotlin:
              type_name: FileObject
      required:
        - type
        - file
      x-stainless-naming:
        go:
          variant_constructor: FileContentPart
    ChatCompletionRequestMessageContentPartImage:
      type: object
      title: Image content part
      description: |
        Learn about image inputs.
      properties:
        type:
          type: string
          enum:
            - image_url
          description: The type of the content part.
          x-stainless-const: true
        image_url:
          type: object
          properties:
            url:
              type: string
              description: Either a URL of the image or the base64 encoded image data.
              format: uri
            detail:
              type: string
              description: 'Specifies the detail level of the image. '
              enum:
                - auto
                - low
                - high
              default: auto
          required:
            - url
      required:
        - type
        - image_url
      x-stainless-naming:
        go:
          variant_constructor: ImageContentPart
    ChatCompletionRequestMessageContentPartRefusal:
      type: object
      title: Refusal content part
      properties:
        type:
          type: string
          enum:
            - refusal
          description: The type of the content part.
          x-stainless-const: true
        refusal:
          type: string
          description: The refusal message generated by the model.
      required:
        - type
        - refusal
    ChatCompletionRequestMessageContentPartText:
      type: object
      title: Text content part
      description: |
        Learn about text inputs.
      properties:
        type:
          type: string
          enum:
            - text
          description: The type of the content part.
          x-stainless-const: true
        text:
          type: string
          description: The text content.
      required:
        - type
        - text
      x-stainless-naming:
        go:
          variant_constructor: TextContentPart
    ChatCompletionRequestSystemMessage:
      type: object
      title: System message
      description: >
        Developer-provided instructions that the model should follow, regardless
        of

        messages sent by the user. With o1 models and newer, use `developer`
        messages

        for this purpose instead.
      properties:
        content:
          description: The contents of the system message.
          anyOf:
            - type: string
              description: The contents of the system message.
              title: Text content
            - type: array
              description: >-
                An array of content parts with a defined type. For system
                messages, only type `text` is supported.
              title: Array of content parts
              items:
                $ref: >-
                  #/components/schemas/ChatCompletionRequestSystemMessageContentPart
              minItems: 1
        role:
          type: string
          enum:
            - system
          description: The role of the messages author, in this case `system`.
          x-stainless-const: true
        name:
          type: string
          description: >-
            An optional name for the participant. Provides the model information
            to differentiate between participants of the same role.
      required:
        - content
        - role
      x-stainless-naming:
        go:
          variant_constructor: SystemMessage
    ChatCompletionRequestSystemMessageContentPart:
      anyOf:
        - $ref: '#/components/schemas/ChatCompletionRequestMessageContentPartText'
    ChatCompletionRequestToolMessage:
      type: object
      title: Tool message
      properties:
        role:
          type: string
          enum:
            - tool
          description: The role of the messages author, in this case `tool`.
          x-stainless-const: true
        content:
          description: The contents of the tool message.
          anyOf:
            - type: string
              description: The contents of the tool message.
              title: Text content
            - type: array
              description: >-
                An array of content parts with a defined type. For tool
                messages, only type `text` is supported.
              title: Array of content parts
              items:
                $ref: >-
                  #/components/schemas/ChatCompletionRequestToolMessageContentPart
              minItems: 1
        tool_call_id:
          type: string
          description: Tool call that this message is responding to.
      required:
        - role
        - content
        - tool_call_id
      x-stainless-naming:
        go:
          variant_constructor: ToolMessage
    ChatCompletionRequestToolMessageContentPart:
      anyOf:
        - $ref: '#/components/schemas/ChatCompletionRequestMessageContentPartText'
    ChatCompletionRequestUserMessage:
      type: object
      title: User message
      description: |
        Messages sent by an end user, containing prompts or additional context
        information.
      properties:
        content:
          description: |
            The contents of the user message.
          anyOf:
            - type: string
              description: The text contents of the message.
              title: Text content
            - type: array
              description: >-
                An array of content parts with a defined type. Supported options
                differ based on the model being used to generate the response.
                Can contain text, image, or audio inputs.
              title: Array of content parts
              items:
                $ref: >-
                  #/components/schemas/ChatCompletionRequestUserMessageContentPart
              minItems: 1
        role:
          type: string
          enum:
            - user
          description: The role of the messages author, in this case `user`.
          x-stainless-const: true
        name:
          type: string
          description: >-
            An optional name for the participant. Provides the model information
            to differentiate between participants of the same role.
      required:
        - content
        - role
      x-stainless-naming:
        go:
          variant_constructor: UserMessage
    ChatCompletionRequestUserMessageContentPart:
      anyOf:
        - $ref: '#/components/schemas/ChatCompletionRequestMessageContentPartText'
        - $ref: '#/components/schemas/ChatCompletionRequestMessageContentPartImage'
        - $ref: '#/components/schemas/ChatCompletionRequestMessageContentPartAudio'
        - $ref: '#/components/schemas/ChatCompletionRequestMessageContentPartFile'
      discriminator:
        propertyName: type
    ChatCompletionResponseMessage:
      type: object
      description: A chat completion message generated by the model.
      properties:
        content:
          type: string
          description: The contents of the message.
          nullable: true
        refusal:
          type: string
          description: The refusal message generated by the model.
          nullable: true
        tool_calls:
          $ref: '#/components/schemas/ChatCompletionMessageToolCalls'
        annotations:
          type: array
          description: |
            Annotations for the message, when applicable, as when using the
            web search tool.
          items:
            type: object
            description: |
              A URL citation when using web search.
            required:
              - type
              - url_citation
            properties:
              type:
                type: string
                description: The type of the URL citation. Always `url_citation`.
                enum:
                  - url_citation
                x-stainless-const: true
              url_citation:
                type: object
                description: A URL citation when using web search.
                required:
                  - end_index
                  - start_index
                  - url
                  - title
                properties:
                  end_index:
                    type: integer
                    description: >-
                      The index of the last character of the URL citation in the
                      message.
                  start_index:
                    type: integer
                    description: >-
                      The index of the first character of the URL citation in
                      the message.
                  url:
                    type: string
                    description: The URL of the web resource.
                  title:
                    type: string
                    description: The title of the web resource.
        role:
          type: string
          enum:
            - assistant
          description: The role of the author of this message.
          x-stainless-const: true
        function_call:
          type: object
          deprecated: true
          description: >-
            Deprecated and replaced by `tool_calls`. The name and arguments of a
            function that should be called, as generated by the model.
          properties:
            arguments:
              type: string
              description: >-
                The arguments to call the function with, as generated by the
                model in JSON format. Note that the model does not always
                generate valid JSON, and may hallucinate parameters not defined
                by your function schema. Validate the arguments in your code
                before calling your function.
            name:
              type: string
              description: The name of the function to call.
          required:
            - name
            - arguments
        audio:
          type: object
          nullable: true
          description: |
            If the audio output modality is requested, this object contains data
            about the audio response from the model. 
          required:
            - id
            - expires_at
            - data
            - transcript
          properties:
            id:
              type: string
              description: Unique identifier for this audio response.
            expires_at:
              type: integer
              description: >
                The Unix timestamp (in seconds) for when this audio response
                will

                no longer be accessible on the server for use in multi-turn

                conversations.
            data:
              type: string
              description: |
                Base64 encoded audio bytes generated by the model, in the format
                specified in the request.
            transcript:
              type: string
              description: Transcript of the audio generated by the model.
      required:
        - role
        - content
        - refusal
    ChatCompletionStreamOptions:
      description: >
        Options for streaming response. Only set this when you set `stream:
        true`.
      type: object
      nullable: true
      default: null
      properties:
        include_usage:
          type: boolean
          description: >
            If set, an additional chunk will be streamed before the `data:
            [DONE]`

            message. The `usage` field on this chunk shows the token usage
            statistics

            for the entire request, and the `choices` field will always be an
            empty

            array.


            All other chunks will also include a `usage` field, but with a null

            value. **NOTE:** If the stream is interrupted, you may not receive
            the

            final usage chunk which contains the total token usage for the
            request.
        include_obfuscation:
          type: boolean
          description: >
            When true, stream obfuscation will be enabled. Stream obfuscation
            adds

            random characters to an `obfuscation` field on streaming delta
            events to

            normalize payload sizes as a mitigation to certain side-channel
            attacks.

            These obfuscation fields are included by default, but add a small
            amount

            of overhead to the data stream. You can set `include_obfuscation` to

            false to optimize for bandwidth if you trust the network links
            between

            your application and the OpenAI API.
    ChatCompletionStreamResponseDelta:
      type: object
      description: A chat completion delta generated by streamed model responses.
      properties:
        content:
          type: string
          description: The contents of the chunk message.
          nullable: true
        function_call:
          deprecated: true
          type: object
          description: >-
            Deprecated and replaced by `tool_calls`. The name and arguments of a
            function that should be called, as generated by the model.
          properties:
            arguments:
              type: string
              description: >-
                The arguments to call the function with, as generated by the
                model in JSON format. Note that the model does not always
                generate valid JSON, and may hallucinate parameters not defined
                by your function schema. Validate the arguments in your code
                before calling your function.
            name:
              type: string
              description: The name of the function to call.
        tool_calls:
          type: array
          items:
            $ref: '#/components/schemas/ChatCompletionMessageToolCallChunk'
        role:
          type: string
          enum:
            - developer
            - system
            - user
            - assistant
            - tool
          description: The role of the author of this message.
        refusal:
          type: string
          description: The refusal message generated by the model.
          nullable: true
    ChatCompletionTokenLogprob:
      type: object
      properties:
        token:
          description: The token.
          type: string
        logprob:
          description: >-
            The log probability of this token, if it is within the top 20 most
            likely tokens. Otherwise, the value `-9999.0` is used to signify
            that the token is very unlikely.
          type: number
        bytes:
          description: >-
            A list of integers representing the UTF-8 bytes representation of
            the token. Useful in instances where characters are represented by
            multiple tokens and their byte representations must be combined to
            generate the correct text representation. Can be `null` if there is
            no bytes representation for the token.
          type: array
          items:
            type: integer
          nullable: true
        top_logprobs:
          description: >-
            List of the most likely tokens and their log probability, at this
            token position. In rare cases, there may be fewer than the number of
            requested `top_logprobs` returned.
          type: array
          items:
            type: object
            properties:
              token:
                description: The token.
                type: string
              logprob:
                description: >-
                  The log probability of this token, if it is within the top 20
                  most likely tokens. Otherwise, the value `-9999.0` is used to
                  signify that the token is very unlikely.
                type: number
              bytes:
                description: >-
                  A list of integers representing the UTF-8 bytes representation
                  of the token. Useful in instances where characters are
                  represented by multiple tokens and their byte representations
                  must be combined to generate the correct text representation.
                  Can be `null` if there is no bytes representation for the
                  token.
                type: array
                items:
                  type: integer
                nullable: true
            required:
              - token
              - logprob
              - bytes
      required:
        - token
        - logprob
        - bytes
        - top_logprobs
    ChatCompletionTool:
      type: object
      title: Function tool
      description: |
        A function tool that can be used to generate a response.
      properties:
        type:
          type: string
          enum:
            - function
          description: The type of the tool. Currently, only `function` is supported.
          x-stainless-const: true
        function:
          $ref: '#/components/schemas/FunctionObject'
      required:
        - type
        - function
    ChatCompletionToolChoiceOption:
      description: >
        Controls which (if any) tool is called by the model.

        `none` means the model will not call any tool and instead generates a
        message.

        `auto` means the model can pick between generating a message or calling
        one or more tools.

        `required` means the model must call one or more tools.

        Specifying a particular tool via `{"type": "function", "function":
        {"name": "my_function"}}` forces the model to call that tool.


        `none` is the default when no tools are present. `auto` is the default
        if tools are present.
      anyOf:
        - type: string
          title: Auto
          description: >
            `none` means the model will not call any tool and instead generates
            a message. `auto` means the model can pick between generating a
            message or calling one or more tools. `required` means the model
            must call one or more tools.
          enum:
            - none
            - auto
            - required
        - $ref: '#/components/schemas/ChatCompletionAllowedToolsChoice'
        - $ref: '#/components/schemas/ChatCompletionNamedToolChoice'
        - $ref: '#/components/schemas/ChatCompletionNamedToolChoiceCustom'
      x-stainless-go-variant-constructor:
        naming: tool_choice_option_{variant}
    FunctionObject:
      type: object
      properties:
        description:
          type: string
          description: >-
            A description of what the function does, used by the model to choose
            when and how to call the function.
        name:
          type: string
          description: >-
            The name of the function to be called. Must be a-z, A-Z, 0-9, or
            contain underscores and dashes, with a maximum length of 64.
        parameters:
          $ref: '#/components/schemas/FunctionParameters'
        strict:
          type: boolean
          nullable: true
          default: false
          description: >-
            Whether to enable strict schema adherence when generating the
            function call. If set to true, the model will follow the exact
            schema defined in the `parameters` field. Only a subset of JSON
            Schema is supported when `strict` is `true`. 
      required:
        - name
    FunctionParameters:
      type: object
      description: >-
        The parameters the functions accepts, described as a JSON Schema object.
        See the guide for examples, and the [JSON Schema
        reference](https://json-schema.org/understanding-json-schema/) for
        documentation about the format. 


        Omitting `parameters` defines a function with an empty parameter list.
      additionalProperties: true

````

	🧠 Gemini 3 Pro (对话/多模态)
	Model: gemini-3-pro-preview
	Endpoint : {{base_url}}/v1/chat/completions
	Endpoint (OpenAI兼容): {{base_url}}/vendors/openai/v1/chat/completions