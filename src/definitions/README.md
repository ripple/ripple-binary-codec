# Definitions

## Types

These are the [types](https://xrpl.org/serialization.html#type-list) associated with a given Serialization Field

## Ledger Entry Types

Each ledger's state tree contain [ledger objects](https://xrpl.org/ledger-object-types.html), which represent all settings, balances, and relationships in the shared ledger. 

## Fields

These are Serialization Fields (`sf`) [defined in rippled's SField.cpp](https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/impl/SField.cpp).

### Key

The key is the string defined in the rippled source code, such as "LedgerEntry", "Transaction", etc.

### nth

`nth` is the index (sort code) used to construct the field code (Field ID) of this field, for use in ordering it with other fields of the same data type.

Each field has a field code, which is used to sort fields that have the same type as one another, with lower codes sorting first.

- [Field definitions](https://github.com/ripple/rippled/blob/72e6005f562a8f0818bc94803d222ac9345e1e40/src/ripple/protocol/impl/SField.cpp#L72-L266)
- [Constructing the `SField` field codes](https://github.com/ripple/rippled/blob/eaff9a0e6aec0ad077f118501791c7684debcfd5/src/ripple/protocol/SField.h#L95-L98)

For example, the `Account` field has sort code (nth) `1`, so it comes before the `Destination` field which has sort code `3`.

Field codes are reused for fields of different field types, but fields of the same type never have the same field code. When you combine the type code with the field code, you get the field's unique _Field ID_.

The unique [Field ID](https://xrpl.org/serialization.html#field-ids) is prefixed before the field in the final serialized blob. The size of the Field ID is one to three bytes depending on the type code and the field codes it combines.

### isVLEncoded

If true, the field is Variable Length encoded and [length-prefixed](https://xrpl.org/serialization.html#length-prefixing). The variable-length encoded fields are `STI_VL`/`Blob`, `STI_ACCOUNT`/`AccountID`, and `STI_VECTOR256`/`Vector256`.

### isSerialized

Fields are serialized if they are not [one of these](https://github.com/ripple/rippled/blob/eaff9a0e6aec0ad077f118501791c7684debcfd5/src/ripple/protocol/impl/SField.cpp#L71-L78) or if they are not an SField.

- https://github.com/ripple/ripple-binary-codec/blob/14e76e68ead7e4bcd83c942dbdc9064d5a66869b/src/enums/definitions.json#L832
- https://github.com/ripple/rippled/search?utf8=%E2%9C%93&q=taker_gets_funded&type=

### isSigningField

True unless the field is [specified with `SField::notSigning`](https://github.com/ripple/rippled/blob/eaff9a0e6aec0ad077f118501791c7684debcfd5/src/ripple/protocol/impl/SField.cpp#L198).

## Transaction Results

See:

- https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/TER.h
- https://xrpl.org/transaction-results.html

TODO: Write a script to read rippled's source file and generate the necessary mapping.

## Transaction Types

See https://github.com/ripple/rippled/blob/develop/src/ripple/protocol/TxFormats.h
