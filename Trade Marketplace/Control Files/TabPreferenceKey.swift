//
//  CategoryControls.swift
//  Trade Marketplace
//
//  Created by William larsen on 8/10/22.
//

import SwiftUI

struct TabPreferenceKey: PreferenceKey  {
    static var defaultValue: CGFloat = 0
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) {
        value = nextValue()
    }
}
