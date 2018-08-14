# AwesomeServer: Paths

This document describes Controllers, how and why to use them, and some of the really awesome things they can do.

## Contents
 - [Why Use Controllers](#why_use_controllers)
 - [Writing a Controller](#writing_a_controller)
 - [Controller Methods](#controller_methods)
 - [Controller Routing](#controller_routing)
 - [Before, After and Any](#before_after_and_any)
 - [Prebuilt Controllers](#prebuild_controllers)
 - [Examples](#examples)

 - [API Documentation for AbstractController]()

## Why Use Controllers

## Writing a Controller

## Controller Methods

## Controller Routing

## Before, After, and Any

#### `before()`

Additionally, a controller may implement the `before(path,request,response)` function which will be executed before the corresponding *HTTP Method* function.

#### `after()`

Additionally, a controller may implement the `after(path,request,response)` function which will be executed after the corresponding *HTTP Method* function.

#### `any()`

In the event the controller does not have a matching *HTTP Method* function, the `any()` function will be called instead. The sub-class of the controller can implement this as a kind of catch-all for request, as desired.  However, not that if the controller doesn't implement it, nothing would occur, which is okay.

## Prebuilt Controllers

## Examples
