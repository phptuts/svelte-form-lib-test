
  <script lang="ts">
    import { createForm } from "svelte-forms-lib";
    import type { Ingredient, Recipe } from "./Recipe";
    import { UnitType } from './Recipe';
    import _ from 'lodash';
    import * as yup from 'yup';
    let recipe: Recipe = {
      name: '',
      description: '',
      ingredients: [
        {
          name: '',
          unitType: UnitType.CUPS,
          amount: 1
        }
      ]
    };
    const recipeSchema =  yup.object().shape({
        name: yup.string().required().min(1).max(3),
        description: yup.string().min(1).max(20),
        ingredients: yup.array().of(yup.object().shape({
          name: yup.string().required('Name is required').min(2).max(100),
          unitType: yup.string().required().oneOf(['CUPS', 'OUNCES']),
          amount: yup.number().required().min(.001).max(1000).required()
        })).required().min(3)
    }).test(c => {

      console.log('validating whole object', c);
      return true;
    });

    const {
      form,
      errors,
      state,
      handleChange,
      handleSubmit,
      handleReset
    } = createForm({
      initialValues: recipe,
      validationSchema: recipeSchema,
      onSubmit: values => {
        alert(JSON.stringify(values));
      }
    });


    const add = () => {
      $form.ingredients = $form.ingredients.concat({ name: '', unitType: 'CUPS', amount: 0 });
      $errors.ingredients = $errors.ingredients.concat({ name: '', unitType: 'CUPS', amount: 0 });
    };

    const remove = i => () => {
      $form.ingredients = $form.ingredients.filter((u, j) => j !== i);
      $errors.ingredients = $errors.ingredients.filter((u, j) => j !== i);
    };
  </script>

  <style>
    .error {
      display: block;
      color: red;
    }
    .form-group {
      display: flex;
      align-items: baseline;
    }
    .button-group {
      display: flex;
    }
    button ~ button {
      margin-left: 15px;
    }
  </style>

<pre>
  {JSON.stringify($form, null,)}
</pre>
<pre>
  {JSON.stringify($errors, null,)}
</pre>
  <form>
    <h1>Recipe</h1>

    <input
            name={`name`}           
            placeholder="name"
            on:change={handleChange}
            on:blur={handleChange}
            bind:value={$form.name}
          />

  {#if $errors.name}
      <small class="error">{$errors.name}</small>
  {/if}

  <input
            name={`description`}           
            placeholder="description"
            on:change={handleChange}
            on:blur={handleChange}
            bind:value={$form.description}
          />

  {#if $errors.description}
      <small class="error">{$errors.description}</small>
  {/if}
  <hr />
    {#each $form.ingredients as ingredient, j}
      <div class="form-group">
        <div>
          <input
            name={`ingredients[${j}].name`}           
            placeholder="name"
            on:change={handleChange}
            on:blur={handleChange}
            bind:value={$form.ingredients[j].name}
          />
          {#if $errors.ingredients[j].name}
            <small class="error">{$errors.ingredients[j].name}</small>
          {/if}
        </div>
        <div>
          <select  
            name={`ingredients[${j}].unitType`}           
            on:change={handleChange}
            on:blur={handleChange}
            bind:value={$form.ingredients[j].unitType}
            >
            <option>CUPS</option>
            <option>OUNCES</option>
          </select>
        </div>

        <div>
          <input
              name={`ingredients[${j}].amount`}
              placeholder="amount"
              on:change={handleChange}
              on:blur={handleChange}
              bind:value={$form.ingredients[j].amount}
            />
          {#if $errors.ingredients[j].amount}
            <small class="error">{$errors.ingredients[j].amount}</small>
          {/if}
        </div>
        
 
        {#if j === $form.ingredients.length - 1}
          <button type="button" on:click={add}>+</button>
        {/if}
        {#if $form.ingredients.length !== 1}
          <button type="button" on:click={remove(j)}>-</button>
        {/if}
      </div>
    {/each}

    <div class="button-group">
      <button type="button" on:click={handleSubmit}>submit</button>
      <button type="button" on:click={handleReset}>reset</button>
    </div>
  </form>

